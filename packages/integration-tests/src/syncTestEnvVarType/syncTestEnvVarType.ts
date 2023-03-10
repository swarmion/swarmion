import type { Node } from '@babel/traverse';
import traverse from '@babel/traverse';
import type { TSTypeElement } from '@babel/types';
import {
  assertFile,
  exportNamedDeclaration,
  identifier,
  isIdentifier,
  isTSPropertySignature,
  isTSTypeLiteral,
  tsPropertySignature,
  tsStringKeyword,
  tsTypeAliasDeclaration,
  tsTypeAnnotation,
  tsTypeLiteral,
} from '@babel/types';
import fs from 'fs';
import { parse, print } from 'recast';

const TYPE_NAME = 'TestEnvVarsType';
const membersContainsVarDeclaration = (
  members: TSTypeElement[],
  envVar: string,
): boolean => {
  return members.some(member => {
    if (isTSPropertySignature(member)) {
      const { key } = member;
      if (isIdentifier(key)) {
        return key.name === envVar;
      }
    }

    return false;
  });
};
// This is extremely fast: first call take max 10ms, subsequent calls take max 2ms
// So it can be called on every CDK synth without any performance impact
export const syncTestEnvVarType = ({
  name,
  filePath,
}: {
  name: string;
  filePath: string;
}): void => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
    }
    const testFile = fs.readFileSync(filePath).toString();
    const ast = parse(testFile, {
      // parser is not typed
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parser: require('recast/parsers/typescript'),
    }) as Node;
    let typeFound = false;
    traverse(ast, {
      TSTypeAliasDeclaration: path => {
        const { node } = path;
        const {
          id: { name: declaredTypeName },
          typeAnnotation,
        } = node;
        if (declaredTypeName === TYPE_NAME && isTSTypeLiteral(typeAnnotation)) {
          typeFound = true;
          const { members } = typeAnnotation;
          if (!membersContainsVarDeclaration(members, name)) {
            members.push(
              tsPropertySignature(
                identifier(name),
                tsTypeAnnotation(tsStringKeyword()),
              ),
            );
            const updatedFile = print(ast).code;
            fs.writeFileSync(filePath, updatedFile);
          }
        }
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- false positive
    if (!typeFound) {
      assertFile(ast);
      ast.program.body.push(
        exportNamedDeclaration(
          tsTypeAliasDeclaration(
            identifier(TYPE_NAME),
            undefined,
            tsTypeLiteral([
              tsPropertySignature(
                identifier(name),
                tsTypeAnnotation(tsStringKeyword()),
              ),
            ]),
          ),
        ),
      );
      const updatedFile = print(ast).code;
      fs.writeFileSync(filePath, updatedFile);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.warn(
        `Error while trying to sync config types: [${e.name}] ${e.message}`,
      );

      return;
    }
    throw e;
  }
};
