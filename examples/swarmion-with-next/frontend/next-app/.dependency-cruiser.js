const commonDependencyCruiserConfig = require('../../commonConfiguration/dependency-cruiser.config');

module.exports = commonDependencyCruiserConfig({
  pathNot: '^(node_modules)',
});
