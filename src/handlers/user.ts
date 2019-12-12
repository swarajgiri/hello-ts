import { Router, Request, Response, NextFunction } from 'express';
import formatPayload from '../modules/formatPayload'
import logger from '../modules/logger';
import validator from 'validator'

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { User } = req.app.get('models')

  let users = []

  try {
    users = await User.find()
  } catch (err) {
    logger.error({ err }, 'Error occurred while fetching list of users')
    return next(err)
  }

  const payload = formatPayload({ data : users })
  return res.status(payload.status).json(payload)
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { errors, sanitizedInput }  = validateNewUser(req)

  if (errors.length) {
    const payload = formatPayload({ errors, status : 400 })
    return res.status(payload.status).json(payload)
  }

  const { name } = sanitizedInput
  const { User } = req.app.get('models')

  let isUserPresent = 0, savedUser = null

  try {
    isUserPresent = await User.where({ name }).countDocuments()

    if (isUserPresent) {
      logger.info({ name }, 'User already present')

      const payload = formatPayload({
        errors: [{
          field: 'name',
          message: `User with name ${name} already exists!`
        }],
        status: 409
      })

      return res.status(payload.status).json(payload)
    }

    logger.info({ name }, 'Saving new user')

    savedUser = await User.create({ name });
  } catch (err) {
    logger.error({ err }, 'Error occurred while saving new user')
    return next(err)
  }

  const payload = formatPayload({ data: savedUser , status: 201 });

  return res.status(payload.status).json(payload);
});

function validateNewUser(req: Request) {
  const errors = []

  if (! req.body.name) {
    errors.push({
      'field': 'name',
      'message': 'Name is required'
    })
  }

  return {
    errors,
    sanitizedInput: {
      name: validator.escape(validator.trim(req.body.name))
    }
  }
}

module.exports = router