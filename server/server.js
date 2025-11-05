import express from 'express';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';
import lawyerRoutes from './routes/lawyerRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/client', clientRoutes);
app.use('/api/lawyer', lawyerRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
