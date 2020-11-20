import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { CHGResourcesStack } from '../lib';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CHGResourcesStack(app, 'CHTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
