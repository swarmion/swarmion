import fs from 'fs';
import * as path from 'path';

import { syncTestEnvVarType } from '../syncTestEnvVarType';

vi.mock('@babel/traverse', async () => {
  const actualTraverse = await vi.importActual('@babel/traverse');
  // @ts-expect-error - issue with esm and traverse: https://github.com/babel/babel/issues/13855
  const traverse = actualTraverse.default as typeof import('@babel/traverse');

  return { default: { default: traverse } };
});

let teardown: () => void;

describe('syncTestEnvVarsTypes', () => {
  afterEach(() => teardown());
  it("creates the file with the type if it doesn't exist", () => {
    const filePath = path.resolve(__dirname, './testCases/newFile.ts');
    teardown = () => fs.unlinkSync(filePath);

    syncTestEnvVarType({ name: 'TOTO', filePath });

    const modifiedFile = fs.readFileSync(filePath).toString();
    expect(modifiedFile).toEqual(`export type TestEnvVarsType = {
  TOTO: string
};`);
  });

  it('creates the type in an existing file without type', () => {
    const filePath = path.resolve(
      __dirname,
      './testCases/existingFileEmpty.ts',
    );
    fs.writeFileSync(filePath, '');
    teardown = () => fs.unlinkSync(filePath);

    syncTestEnvVarType({ name: 'TOTO', filePath });

    const modifiedFile = fs.readFileSync(filePath).toString();
    expect(modifiedFile).toEqual(`export type TestEnvVarsType = {
  TOTO: string
};`);
  });

  it('creates the type in an existing file without type', () => {
    const filePath = path.resolve(
      __dirname,
      './testCases/existingFileWithoutType.ts',
    );
    const backup = fs.readFileSync(filePath).toString();
    teardown = () => fs.writeFileSync(filePath, backup);

    syncTestEnvVarType({ name: 'TOTO', filePath });

    const modifiedFile = fs.readFileSync(filePath).toString();
    expect(modifiedFile).toEqual(`export const TUTU = 'tutu';

export type TestEnvVarsType = {
  TOTO: string
};
`);
  });

  it('adds the name of the env var to an empty existing type', () => {
    const filePath = path.resolve(
      __dirname,
      './testCases/existingTypeEmpty.ts',
    );
    const backup = fs.readFileSync(filePath).toString();
    teardown = () => fs.writeFileSync(filePath, backup);

    syncTestEnvVarType({ name: 'TOTO', filePath });

    const modifiedFile = fs.readFileSync(filePath).toString();
    expect(modifiedFile)
      .toEqual(`// eslint-disable-next-line @typescript-eslint/ban-types
export type TestEnvVarsType = {
  TOTO: string
};
`);
  });

  it('adds the name of the env var to an existing type with another name', () => {
    const filePath = path.resolve(
      __dirname,
      './testCases/existingTypeWithOtherName.ts',
    );
    const backup = fs.readFileSync(filePath).toString();
    teardown = () => fs.writeFileSync(filePath, backup);

    syncTestEnvVarType({ name: 'TOTO', filePath });

    const modifiedFile = fs.readFileSync(filePath).toString();
    expect(modifiedFile).toEqual(`export type TestEnvVarsType = {
  TITI: string;
  TOTO: string
};
`);
  });

  it("doesn't change the type if the name of the env var is already declared", () => {
    const filePath = path.resolve(
      __dirname,
      './testCases/existingTypeWithExistingName.ts',
    );
    const backup = fs.readFileSync(filePath).toString();
    teardown = () => fs.writeFileSync(filePath, backup);

    syncTestEnvVarType({ name: 'TOTO', filePath });

    const modifiedFile = fs.readFileSync(filePath).toString();
    expect(modifiedFile).toEqual(`export type TestEnvVarsType = {
  TOTO: string;
};
`);
  });
});
