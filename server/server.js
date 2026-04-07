const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const memberRoutes = require('./routes/members');
const statsRoutes = require('./routes/stats');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/members', memberRoutes);
app.use('/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Project Management API with MongoDB is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
