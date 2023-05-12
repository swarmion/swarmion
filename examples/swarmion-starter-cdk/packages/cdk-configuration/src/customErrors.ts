export class CdkDeploymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CdkDeploymentError';
  }
}
