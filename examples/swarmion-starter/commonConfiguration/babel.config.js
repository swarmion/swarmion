const defaultPresets = [
  ['@babel/preset-typescript', { allowNamespaces: true }],
];

const defaultIgnores = [/.*\/(.*\.|)test\.tsx?/, /node_modules/, /dist/];

const defaultPlugins = [
  [
    'module-resolver',
    {
      root: ['./src'],
      extensions: ['.ts', '.tsx'],
    },
  ],
  '@babel/plugin-transform-runtime',
];

const presetsForESM = [
  [
    '@babel/preset-env',
    {
      modules: false,
    },
  ],
  ...defaultPresets,
];
const presetsForCJS = [
  [
    '@babel/preset-env',
    {
      modules: 'cjs',
    },
  ],
  ...defaultPresets,
];

module.exports = (plugins = [], presets = []) => {
  return {
    env: {
      cjs: {
        presets: [...presets, ...presetsForCJS],
      },
      esm: {
        presets: [...presets, ...presetsForESM],
      },
    },
    ignore: defaultIgnores,
    plugins: [...plugins, ...defaultPlugins],
  };
};
