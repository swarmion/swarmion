import { CORS_ALLOWED_ORIGINS } from 'shared/constants';

vitest.stubEnv(CORS_ALLOWED_ORIGINS, JSON.stringify([]));
