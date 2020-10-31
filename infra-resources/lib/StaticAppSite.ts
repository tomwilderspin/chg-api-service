import { Construct } from "@aws-cdk/core";
import * as CDK from '@aws-cdk/core';
import * as S3 from '@aws-cdk/aws-s3';
import * as IAM from '@aws-cdk/aws-iam';

export interface StaticAppSiteProps {
  domainName: string
  appSubDomain: string
}

export default class StaticAppSite extends Construct {

  constructor(parent: Construct, name: string, props: StaticAppSiteProps) {
    super(parent, name);

    const siteDomain = `${props.appSubDomain}.${props.domainName}`;
    new CDK.CfnOutput(this, 'SiteUrl', { value: `https://${siteDomain}` });

    // IAM policies.
    const appBucketAccessPolicy = new IAM.PolicyStatement({

    })

    // web app bucket.
    const corsRule = { 
      allowedMethods: [S3.HttpMethods.GET],
      allowedOrigins: [`https://${siteDomain}`],
      allowedHeaders: ['*'],
    }
    const appBucket = new S3.Bucket(this, 'appBucket', {
      bucketName: 'web-application',
      cors: [corsRule],
      publicReadAccess: false,      
      versioned: true,
      encryption: S3.BucketEncryption.S3_MANAGED,
      //don't delete the bucket on stack destroy.  
      removalPolicy: CDK.RemovalPolicy.RETAIN, 
    });

  }

}