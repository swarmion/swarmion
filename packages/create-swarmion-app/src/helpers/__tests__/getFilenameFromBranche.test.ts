import getFilenameFromBranch from '../getFilenameFromBranch';

describe('getFilenameFromBranch', () => {
  it.each([
    { branchName: 'master', expectedResult: 'master' },
    {
      branchName: 'feat/this-is-a-feature',
      expectedResult: 'feat-this-is-a-feature',
    },
    {
      branchName: 'fix/swarmion/guid/guiv',
      expectedResult: 'fix-swarmion-guid-guiv',
    },
  ])(
    'should parse branch names $branchName into $expectedResult',
    ({ branchName, expectedResult }) => {
      const fileName = getFilenameFromBranch(branchName);
      expect(fileName).toEqual(expectedResult);
    },
  );

  it.each([
    { branchName: 'v0.0.0', expectedResult: '0.0.0' },
    { branchName: 'v1.0.0', expectedResult: '1.0.0' },
    { branchName: 'v123.456.789', expectedResult: '123.456.789' },
  ])(
    'should parse tag branches $branchName into $expectedResult',
    ({ branchName, expectedResult }) => {
      const fileName = getFilenameFromBranch(branchName);
      expect(fileName).toEqual(expectedResult);
    },
  );

  it.each([
    { branchName: 'v0.7.1-alpha.0', expectedResult: '0.7.1-alpha.0' },
    { branchName: 'v0.7.2-beta.1', expectedResult: '0.7.2-beta.1' },
    { branchName: 'v12.34.56-alpha.789', expectedResult: '12.34.56-alpha.789' },
    { branchName: 'v98.76.54-beta.321', expectedResult: '98.76.54-beta.321' },
  ])(
    'should parse tag branches $branchName into $expectedResult',
    ({ branchName, expectedResult }) => {
      const fileName = getFilenameFromBranch(branchName);
      expect(fileName).toEqual(expectedResult);
    },
  );
});
