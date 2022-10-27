import listDeployments from './listDeployments/config';
import onDeploymentRequested from './onDeploymentRequested/config';
import requestSyncDeployment from './requestSyncDeployment/config';

export const functions = {
  requestSyncDeployment,
  listDeployments,
  onDeploymentRequested,
};
