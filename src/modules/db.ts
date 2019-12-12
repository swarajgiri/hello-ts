import * as mongoose from 'mongoose';
import config from '../config';
import User from './schemas/user';
import Hobby from './schemas/hobby';
const { uri, options } = config.db.mongodb;

const connectToDb = () => {
  return mongoose.connect(uri, options);
};

const models = {
  User,
  Hobby
};

export { connectToDb };
export default models;