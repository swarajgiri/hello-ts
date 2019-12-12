import { Router, Request, Response, NextFunction } from 'express';
import formatPayload from '../modules/formatPayload'
import logger from '../modules/logger';
import validator from 'validator'
import mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const { Hobby } = req.app.get('models')

  let hobbies = []

  try {
    hobbies = await Hobby.find().populate('userId')
  } catch (err) {
    logger.error({ err }, 'Error occurred while fetching list of hobbies')
    return next(err)
  }

  const payload = formatPayload({ data : hobbies })
  return res.status(payload.status).json(payload)
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { errors, sanitizedInput }  = validateNewHobby(req)

  if (errors.length) {
    const payload = formatPayload({ errors, status : 400 })
    return res.status(payload.status).json(payload)
  }

  const { name, passionLevel, year, userId } = sanitizedInput
  const { User, Hobby } = req.app.get('models')

  let isUserPresent = 0, savedHobby = null, isHobbyUniqueForUser

  try {
    isUserPresent = await User.where({ '_id': ObjectId(userId) }).countDocuments()

    if (! isUserPresent) {
      logger.info({ userId }, 'User not found')

      const payload = formatPayload({
        errors: [{
          field: 'userId',
          message: `User with id ${userId} not found`
        }],
        status: 404
      })

      return res.status(payload.status).json(payload)
    }

    logger.info({ sanitizedInput }, 'Saving new hobby')

    isHobbyUniqueForUser = await Hobby.find({ 'userId': ObjectId(userId), name }).countDocuments()

    if (isHobbyUniqueForUser) {
      const payload = formatPayload({
        errors: [
          {
            field: 'userId/name',
            message : `User with id ${userId} and hobby ${name} already exist!`
          }
        ],
        status: 409
      })

      return res.status(payload.status).json(payload)
    }

    savedHobby = await Hobby.create(sanitizedInput);
  } catch (err) {
    logger.error({ err }, 'Error occurred while saving new hobby')
    return next(err)
  }

  const payload = formatPayload({ data: savedHobby , status: 201 });

  return res.status(payload.status).json(payload);
});

router.delete('/:hobbyId', async (req: Request, res: Response, next: NextFunction) => {
  const { errors, sanitizedInput } = validateHobbyDeletion(req)

  if (errors.length) {
    const payload = formatPayload({ errors, status : 400 })
    return res.status(payload.status).json(payload)
  }

  const { Hobby } = req.app.get('models')
  const { hobbyId } = sanitizedInput

  let hobbyToDelete = null, isDeleted

  try {
    hobbyToDelete = await Hobby.findOne({ '_id': ObjectId(hobbyId) })

    if (! hobbyToDelete) {
      const payload = formatPayload({
        errors: [{
          field: 'hobbyId',
          message: `Hobby with id ${hobbyId} not found`
        }],
        status: 404
      })

    return res.status(payload.status).json(payload)
  }

  logger.info({ hobbyId }, 'Deleting hobby with id')

  isDeleted = await Hobby.deleteOne({ '_id': ObjectId(hobbyId)})

  } catch (err) {
    logger.error({ err, hobbyId }, 'Error occurred while deleting hobby')
    return next(err)
  }

  const payload = formatPayload({
    data: isDeleted
  })

  return res.status(payload.status).json(payload);
})

function validateNewHobby(req: Request) {
  const errors = []

  if (! req.body.name) {
    errors.push({
      'field': 'name',
      'message': 'Hobby name is required'
    })
  }

  if (! req.body.passionLevel) {
    errors.push({
      'field': 'passionLevel',
      'message': 'Passion level is required'
    })
  }

  if (! req.body.year || !validator.toDate(req.body.year)) {
    errors.push({
      'field': 'year',
      'message': 'Year is required and must be a valid date'
    })
  }

  if (! req.body.userId || !validator.isMongoId(req.body.userId)) {
    errors.push({
      'field': 'userId',
      'message': 'UserId is required and must be a valid mongodb id'
    })
  }

  return {
    errors,
    sanitizedInput: {
      name: validator.escape(validator.trim(req.body.name)),
      passionLevel: validator.escape(validator.trim(req.body.passionLevel)),
      year: validator.toDate(req.body.year),
      userId: req.body.userId
    }
  }
}

function validateHobbyDeletion(req: Request) {
  const errors = []

  if (! req.params.hobbyId || !validator.isMongoId(req.params.hobbyId)) {
    errors.push({
      'field': 'hobbyId',
      'message': 'hobbyId is required and must be a valid mongodb id'
    })
  }

  return {
    errors,
    sanitizedInput: {
      hobbyId: req.params.hobbyId
    }
  }
}

module.exports = router