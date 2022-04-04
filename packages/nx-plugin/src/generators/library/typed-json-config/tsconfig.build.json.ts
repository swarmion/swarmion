import { TsConfig } from '../../types';

export const packageBuildTsConfig: TsConfig = {
  extends: './tsconfig.json',
  compilerOptions: {
    rootDir: 'src',
  },
  exclude: ['./jest.config.ts', './**/*.test.ts'],
};
