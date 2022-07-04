export default (branch: string): string => {
  if (branch.match(/v(\d+)\.(\d+)\.(\d+)((-(alpha|beta).(\d+))?)/)) {
    return branch.slice(1);
  }

  return branch.replace(/\//g, '-');
};
