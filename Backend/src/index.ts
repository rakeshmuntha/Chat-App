import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import http from 'http'
import { connectDb } from './lib/db';

const app = express();
const PORT = process.env.port || 3001;
const server = http.createServer(app);

app.use(express.json({limit: "4mb"}));
app.use(cors());

connectDb();

app.get('/', (req, res) => {
  res.json('Backend running!');
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// • npm run dev – starts dev server with reload
// • npm run build – compiles TypeScript to JS
// • npm start – runs compiled backend