const commonDependencyCruiserConfig = require('../../commonConfiguration/dependency-cruiser.config');

const path = ['src'];
const pathNot = ['dist'];

module.exports = commonDependencyCruiserConfig({ path, pathNot });
