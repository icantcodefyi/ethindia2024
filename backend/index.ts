import express from 'express';
import codeGenerationRouter from './routes/codeGeneration';
import { config } from 'dotenv';
config();

const app = express();

app.use(express.json());

app.use('/api/generate', codeGenerationRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});