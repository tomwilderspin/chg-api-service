#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CHGResourcesStack } from '../lib/';

const app = new cdk.App();
new CHGResourcesStack(app, 'CHGResources', { env: {
  region: 'eu-west-1',
}});
