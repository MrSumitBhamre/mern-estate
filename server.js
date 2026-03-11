const app = require('./src/app');
const env = require('./src/config/env.config');
const logger = require('./src/config/logger.config');

app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
});