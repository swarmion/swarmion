import getFilenameFromBranch from '../getFilenameFromBranch';

getFilenameFromBranch;
interface TestInput {
  branchName: string;
  expectedResult: string;
}

describe('getFilenameFromBranch', () => {
  it.each`
    branchName                  | expectedResult
    ${'master'}                 | ${'master'}
    ${'feat/this-is-a-feature'} | ${'feat-this-is-a-feature'}
    ${'fix/swarmion/guid/guiv'} | ${'fix-swarmion-guid-guiv'}
  `(
    'should parse branch names $branchName into $expectedResult',
    ({ branchName, expectedResult }: TestInput) => {
      const fileName = getFilenameFromBranch(branchName);
      expect(fileName).toEqual(expectedResult);
    },
  );

  it.each`
    branchName        | expectedResult
    ${'v0.0.0'}       | ${'0.0.0'}
    ${'v1.0.0'}       | ${'1.0.0'}
    ${'v123.456.789'} | ${'123.456.789'}
  `(
    'should parse tag branches $branchName into $expectedResult',
    ({ branchName, expectedResult }: TestInput) => {
      const fileName = getFilenameFromBranch(branchName);
      expect(fileName).toEqual(expectedResult);
    },
  );

  it.each`
    branchName               | expectedResult
    ${'v0.7.1-alpha.0'}      | ${'0.7.1-alpha.0'}
    ${'v0.7.2-beta.1'}       | ${'0.7.2-beta.1'}
    ${'v12.34.56-alpha.789'} | ${'12.34.56-alpha.789'}
    ${'v98.76.54-beta.321'}  | ${'98.76.54-beta.321'}
  `(
    'should parse tag branches $branchName into $expectedResult',
    ({ branchName, expectedResult }: TestInput) => {
      const fileName = getFilenameFromBranch(branchName);
      expect(fileName).toEqual(expectedResult);
    },
  );
});
