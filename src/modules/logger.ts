import * as bunyan from 'bunyan'
const app = require('../../package.json')

const logger = bunyan.createLogger({
  name: `${app.name}-${app.version}`,
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
  ],
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  }
});

export default logger;