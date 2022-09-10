export interface PackageJson {
  [key: string]: unknown;
  name: string;
  private: boolean;
  version: string;
  license: string;
  sideEffects?: boolean;
  files?: string[];
  main?: string;
  module?: string;
  types?: string;
  scripts: {
    [key: string]: string;
    'lint-fix': string;
    'lint-fix-all': string;
    'linter-base-config': string;
    test: string;
    'test-linter': string;
    'test-type': string;
    'test-unit': string;
  };
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
    '@types/node': string;
    vitest: string;
    'ts-node': string;
    typescript: string;
  };
}
