import { CloudFormationContract } from '../cloudFormationContract';

describe('cloudFormationContract', () => {
  const cloudFormationContract = new CloudFormationContract({
    name: 'mySuperExport',
  });

  it('should return the correct importValue', () => {
    expect(cloudFormationContract.importValue).toEqual({
      'Fn::ImportValue': 'mySuperExport',
    });
  });

  it('should return the correct exportValue', () => {
    expect(
      cloudFormationContract.exportValue({
        description: 'My super export',
        value: { Ref: 'HttpApi' },
      }),
    ).toEqual({
      Description: 'My super export',
      Value: { Ref: 'HttpApi' },
      Export: { Name: 'mySuperExport' },
    });
  });
});
