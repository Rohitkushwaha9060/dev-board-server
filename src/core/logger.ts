import { Logger } from '@rohit2005/logger';
import { secrets } from './secrets';

export const logger = new Logger({
    logFiles: secrets.NODE_ENV === 'production' ? true : false,
});
