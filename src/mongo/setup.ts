import mongoose from 'mongoose';
import config from '../shared/config';

const connect = async () => {
  try {
    await mongoose.connect(config.dbConnection)

    console.log('Successfully connected');
  } catch (error) {
    console.log('Error connection: ' +error);
  }
}

connect();