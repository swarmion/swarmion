import packageJson from '../package.json';

const getRef = (ref: unknown): string => {
  if (typeof ref === 'string') {
    return ref;
  }

  const packageVersion = packageJson.version;

  return `v${packageVersion}`;
};

export default getRef;
