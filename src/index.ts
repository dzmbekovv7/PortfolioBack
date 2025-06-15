import express from 'express';
import mailRoutes from './routes/mailRoutes'
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/mail', mailRoutes)
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
  