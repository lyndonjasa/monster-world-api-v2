import express from 'express'
import cors from 'cors'

import * as dotenv from 'dotenv'
dotenv.config({ path: `./src/environments/.env.${process.env.NODE_ENV.trim()}` });

import './mongo/setup'
import config from './shared/config'

const app = express();
app.use(cors());
app.use(express.json());

import routes from './routes'

routes.forEach(r => {
  app.use(r);
})

app.get('/', (_, res) => {
  res.send('Monster World API v2 ' + config.environment);
});

export default app;