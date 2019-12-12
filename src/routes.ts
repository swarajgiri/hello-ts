import * as swaggerUi from 'swagger-ui-express'
const swaggerDocument = require('./swagger.json')

module.exports = (app) => {
  app.use('/api/v1/users', require('./handlers/user'))
  app.use('/api/v1/hobbies', require('./handlers/hobby'))

  if (process.env.NODE_ENV === 'development') {
    app.use('/swagger', swaggerUi.serve)
    app.get('/swagger', swaggerUi.setup(swaggerDocument))
  }
}
