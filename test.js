/*
โครงสร้างโปรเจกต์:
- frontend/ (React + Next.js + Tailwind CSS)
- backend/ (Node.js + Express + MongoDB)
*/

// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/weight_loss_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// backend/models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  weight: Number,
  height: Number,
  goal: String,
  workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
});
module.exports = mongoose.model('User', UserSchema);

// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, weight, height, goal } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, weight, height, goal });
  await newUser.save();
  res.json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  res.json({ token, user });
});

module.exports = router;

/*
ส่วน Frontend จะถูกสร้างในโฟลเดอร์ frontend/ ด้วย Next.js และ Tailwind CSS
*/

