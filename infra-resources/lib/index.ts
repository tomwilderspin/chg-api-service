import * as cdk from '@aws-cdk/core';
import StaticAppSite from './StaticAppSite';

export class CHGResourcesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const appSite = new StaticAppSite(this, 'AppSite', {
      domainName: this.node.tryGetContext('domain'),
      appSubDomain: this.node.tryGetContext('subdomain')
    });

    // The code that defines your stack goes here
  }
}

