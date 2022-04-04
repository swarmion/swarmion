import { CompilerOptions } from 'typescript';

export type TsConfig = {
  extends: string;
  compilerOptions: CompilerOptions;
  files?: string[];
  include?: string[];
  exclude?: string[];
  references?: { path: string }[];
  'ts-node'?: {
    files: boolean;
  };
};
