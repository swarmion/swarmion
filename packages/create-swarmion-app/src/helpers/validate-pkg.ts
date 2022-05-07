import validateProjectName from 'validate-npm-package-name';

type ValidateOutput =
  | {
      valid: false;
      problems: string[];
    }
  | { valid: true; problems: null };

export const validateNpmName = (name: string): ValidateOutput => {
  const nameValidation = validateProjectName(name);
  if (nameValidation.validForNewPackages) {
    return { valid: true, problems: null };
  }

  return {
    valid: false,
    problems: [
      ...(nameValidation.errors ?? []),
      ...(nameValidation.warnings ?? []),
    ],
  };
};
