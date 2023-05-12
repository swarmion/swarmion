/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = ({ pathNot, path } = { pathNot: [], path: [] }) => ({
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: { pathNot, path },
      to: {
        circular: true,
      },
    },
    {
      name: 'no-provisioning-in-application',
      severity: 'error',
      comment:
        'Please do not import provisioning code in your application code.',
      from: {
        path: '^functions',
        pathNot: '^functions.+config',
      },
      to: { path: '^resources|^functions.+config' },
    },
    {
      name: 'no-application-in-provisioning',
      severity: 'error',
      comment:
        'Please do not import application code in your provisioning code.',
      from: { path: '^resources|^functions.+config' },
      to: {
        // you can remove contracts if you only use shared contracts
        pathNot: '^resources|^functions.+config|^shared|^contracts',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
        'npm-no-pkg',
      ],
    },

    exclude: {
      path: ['cdk.out', 'node_modules', 'dist/index'],
    },

    moduleSystems: ['amd', 'cjs', 'es6', 'tsd'],

    tsPreCompilationDeps: true,

    tsConfig: {
      fileName: 'tsconfig.json',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],

      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
      archi: {
        collapsePattern:
          '^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+|node_modules/[^/]+',
      },
    },
  },
});
