import 'dotenv/config';
import express from 'express';
import { resolve } from 'path';
import cors from 'cors';

import routes from './routes';

const app = express();

const { HOST = 'localhost', PORT = 3333 } = process.env;

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});
