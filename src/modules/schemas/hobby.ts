import mongoose = require('mongoose')
import Schema = mongoose.Schema;
import Document = mongoose.Document;

export interface IHobby extends Document {
  passionLevel: String;
  name : String;
  year: Date;
  userId: String;
}

const HobbySchema : Schema = new Schema({
  passionLevel : { type : String, required : true },
  name : { type : String, required : true },
  year : { type : Date, required : true },
  userId : { type : 'ObjectId', required : true, ref: 'User' },
});

export default mongoose.model<IHobby>('Hobby', HobbySchema)
