import { Construct, Stack } from "@aws-cdk/core";
import * as CDK from '@aws-cdk/core';
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';
import * as CloudFront from '@aws-cdk/aws-cloudfront';

export interface StaticAppSiteProps {
  domainName: string
  appSubDomain: string
  certArn: string
}

export default class StaticAppSite extends Construct {

  constructor(parent: Construct, name: string, props: StaticAppSiteProps) {
    super(parent, name);

    const siteDomain = `${props.appSubDomain}.${props.domainName}`;
    new CDK.CfnOutput(this, 'SiteUrl', { value: `https://${siteDomain}` });

    // web app bucket.
    const corsRule = { 
      allowedMethods: [S3.HttpMethods.GET],
      allowedOrigins: [`https://${siteDomain}`],
      allowedHeaders: ['*'],
    }
    const appBucket = new S3.Bucket(this, 'appBucket', {
      bucketName: 'chg-web-app',
      cors: [corsRule],
      publicReadAccess: false,      
      versioned: true,
      encryption: S3.BucketEncryption.S3_MANAGED,
      //don't delete the bucket on stack destroy.  
      removalPolicy: CDK.RemovalPolicy.RETAIN, 
    });

    // cdn (Cloud Front)

    const appCdn = new CloudFront.Distribution(this, 'ChgWebApp', {
      //todo add some config here...
    });

    /**
     * const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [ siteDomain ],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    customOriginSource: {
                        domainName: siteBucket.bucketWebsiteDomainName,
                        originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                    },          
                    behaviors : [ {isDefaultBehavior: true}],
                }
            ]
        });
     */
    

    // IAM policies.
    const appBucketGetObjAccessPolicy = new IAM.PolicyStatement({
      effect: IAM.Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [appBucket.arnForObjects("*")],
    });
    const appBucketListObjAccessPolicy = new IAM.PolicyStatement({
      effect: IAM.Effect.ALLOW,
      actions: ['s3:ListBucket'],
      resources: [appBucket.bucketArn],
    });

    //assign bucket policy
    appBucket.addToResourcePolicy(appBucketGetObjAccessPolicy);
    appBucket.addToResourcePolicy(appBucketListObjAccessPolicy); 
  }

}