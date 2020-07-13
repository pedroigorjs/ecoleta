import 'dotenv/config';
import express from 'express';

import routes from './routes';

const app = express();

const { HOST = 'localhost', PORT = 3333 } = process.env;

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});
