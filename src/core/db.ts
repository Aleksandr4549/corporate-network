import mongoose from 'mongoose';

mongoose.Promise = Promise;

const uri = 'mongodb+srv://Aleksandr:441$efwWW$21gcs@cluster0.l3ags.azure.mongodb.net/chat?retryWrites=true&w=majority'


mongoose.connect(process.env.MONGODB_URI || uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

export {db, mongoose};