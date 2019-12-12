import * as express from 'express'
import * as bodyParser from 'body-parser'
import models, { connectToDb } from './modules/db'
import config from './config'
import logger from './modules/logger'
import formatPayload from './modules/formatPayload'

const { port } = config
const app: express.Application = express()

app.use(bodyParser.json())

app.set('models', models)

require('../src/routes')(app)

app.use((err: Error & { status: number }, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  logger.error({ err }, 'Something broke!')

  const payload = formatPayload({
    errors: [
      {
        field: 'Server',
        message: 'Oops! Something broke!'
      }
    ],
    status: err.status || 500
  })

  res.status(payload.status).json(payload)
})

connectToDb()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server listening on port ${port}`)
    })
  })
  .catch((err: Error) => {
    logger.fatal({ err }, 'Error occurred while starting up app server')
  })
