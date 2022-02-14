import { is_production } from 'config/index';

type TLogger = 'log' | 'error' | 'warn' | 'info';

/**
 * @param {string} [title] set the title of info
 * @param {any} [msg] main block of the info
 * @param {string} [type] type of log
 */
const logger = (title?: string, msg?: any, type: TLogger = 'info'): void => {
  if (!is_production) {
    console[type](`${title}\n${JSON.stringify(msg)}`);
  }
};

export default logger;