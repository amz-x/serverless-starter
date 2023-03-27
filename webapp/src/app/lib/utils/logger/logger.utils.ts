import { Logger } from 'aws-amplify';
import { LOG_TYPE } from '@aws-amplify/core/lib-esm/Logger';

export const logger = new Logger('@LOGGER', LOG_TYPE.VERBOSE);
