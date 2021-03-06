import { Rule } from 'eslint';
import findUp from 'find-up';
import { readFileSync } from 'fs';
import path from 'path';

const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ImportDeclaration: node => {
      const importedModule = node.source.value;
      if (typeof importedModule !== 'string') {
        return;
      }

      const importedModulePackageJson = `node_modules/${importedModule}/package.json`;
      const targetDirectory = findUp.sync(
        directory => {
          const packageJsonFound = findUp.sync.exists(
            path.join(directory, importedModulePackageJson),
          );
          if (!packageJsonFound) {
            return undefined;
          }

          return directory;
        },
        { type: 'directory' },
      );

      if (targetDirectory === undefined) {
        return;
      }

      const importeModulePackageJson = path.join(
        targetDirectory,
        importedModulePackageJson,
      );

      const packageJsonFile = JSON.parse(
        readFileSync(importeModulePackageJson, 'utf8'),
      ) as Record<string, unknown>;

      if (packageJsonFile.contracts !== true) {
        return;
      }

      const currentDirectoryServerlessConf = path.join(
        context.getCwd(),
        'serverless.ts',
      );

      const closestServerlessTsPath = findUp.sync.exists(
        currentDirectoryServerlessConf,
      )
        ? currentDirectoryServerlessConf
        : findUp.sync('serverless.ts');

      if (closestServerlessTsPath === undefined) {
        return;
      }

      const serverlessConfFile = readFileSync(closestServerlessTsPath, 'utf-8');

      const contracts = node.specifiers.map(specifier => specifier.local.name);

      const invalidContracts = contracts.filter(contract => {
        const contractRegex = new RegExp(
          `contracts: {(\n|.)*(provides|consumes): {(\n|.)*${contract}`,
        );

        return !contractRegex.test(serverlessConfFile);
      });

      if (invalidContracts.length === 0) {
        return;
      }

      context.report({
        node,
        message: `Contract${
          invalidContracts.length > 1 ? 's' : ''
        } ${invalidContracts
          .map(invalidContract => `\`${invalidContract}\``)
          .join(
            ', ',
          )} from package '${importedModule}' must be declared in the \`contracts.consumes\` or \`contracts.provides\` property of the 'serverless.ts' service file`,
      });
    },
  };
};

const module: Rule.RuleModule = {
  create,
};

export default module;
