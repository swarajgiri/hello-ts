import mongoose = require('mongoose')
import Schema = mongoose.Schema;
import Document = mongoose.Document;

export interface IUser extends Document {
  name : String;
}

const UserSchema : Schema = new Schema({
  name : { type : String, required : true, unique : true }
});

export default mongoose.model<IUser>('User', UserSchema)
