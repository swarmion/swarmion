const defaultPresets = [
  ['@babel/preset-typescript', { allowNamespaces: true }],
];

const defaultIgnores = [/.*\/(.*\.|)test\.tsx?/, /node_modules/, /dist/];

const defaultPlugins = [
  [
    'module-resolver',
    {
      root: ['./src'],
      extensions: ['.ts'],
    },
  ],
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

module.exports = {
  presets: presetsForCJS,
  ignore: defaultIgnores,
  plugins: defaultPlugins,
};
