import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js'; // <--- 1. Import the routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Mount the API routes at '/api/v1'
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Kisan AI Backend is running 🚜' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
});