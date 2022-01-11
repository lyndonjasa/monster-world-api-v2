import express from 'express'
import cors from 'cors'

import * as dotenv from 'dotenv'
dotenv.config({ path: `./src/environments/.env.${process.env.NODE_ENV}` });

import config from './shared/config'
console.log(config);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Monster World API v2 ' + config.dbConnection);
});

export default app;