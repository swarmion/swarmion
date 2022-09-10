import { TsConfig } from '../../types';

export const packageBuildTsConfig: TsConfig = {
  extends: './tsconfig.json',
  compilerOptions: {
    rootDir: 'src',
  },
  exclude: ['./vite*', './**/*.test.ts'],
};
