import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as path from 'path';
import { expect } from 'vitest';

import {
  SCOPE_CONTEXT_NAME,
  TestEnvVar,
  TYPE_PATH_CONTEXT_NAME,
} from '../TestEnvVarConstruct';
import { syncTestEnvVarType } from '../syncTestEnvVarType';

vi.mock('../syncTestEnvVarType');

describe('TestEnvVarConstruct', () => {
  it('creates a SSM parameter with the provided value and a name from the id', () => {
    const stack = new Stack();
    new TestEnvVar(stack, 'TOTO', { value: 'testValue' });

    Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/testEnvVars/TOTO',
      Type: 'String',
      Value: 'testValue',
    });

    expect(syncTestEnvVarType).not.toHaveBeenCalled();
  });
  it('creates a SSM parameter with the provided value and a name from the id and scope if the scope context is defined', () => {
    const stack = new Stack();
    stack.node.setContext(SCOPE_CONTEXT_NAME, 'myScope');
    new TestEnvVar(stack, 'TOTO', { value: 'testValue' });

    Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter', {
      Name: '/testEnvVars/myScope/TOTO',
      Type: 'String',
      Value: 'testValue',
    });

    expect(syncTestEnvVarType).not.toHaveBeenCalled();
  });
  it('syncs the variable name into a type file if provided in the context', () => {
    const stack = new Stack();
    const filePath = path.resolve(__dirname, './envVarTypes.ts');
    stack.node.setContext(TYPE_PATH_CONTEXT_NAME, filePath);
    new TestEnvVar(stack, 'TOTO', { value: 'testValue' });

    expect(syncTestEnvVarType).toHaveBeenCalledOnce();
    expect(syncTestEnvVarType).toHaveBeenCalledWith({ name: 'TOTO', filePath });
  });
});
