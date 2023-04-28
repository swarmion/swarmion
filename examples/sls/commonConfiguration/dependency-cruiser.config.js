/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: {},
      to: {
        circular: true,
      },
    },
  ],
  options: {
    exclude: {
      path: ['cdk.out', 'node_modules', 'dist'],
    },
    tsPreCompilationDeps: true,
    tsConfig: {},
  },
};
