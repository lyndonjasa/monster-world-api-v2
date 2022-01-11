import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Monster World API v2');
});

export default app;