const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './users.json';
const MESSAGES_FILE = './messages.json';
const RESET_TOKENS_FILE = './resetTokens.json';

const readUsers = () => {
  const usersData = fs.readFileSync(USERS_FILE);
  return JSON.parse(usersData);
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const readResetTokens = () => {
  if (fs.existsSync(RESET_TOKENS_FILE)) {
    const tokensData = fs.readFileSync(RESET_TOKENS_FILE);
    return JSON.parse(tokensData);
  }
  return [];
};

const writeResetTokens = (tokens) => {
  fs.writeFileSync(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2));
};

const readMessages = () => {
  if (fs.existsSync(MESSAGES_FILE)) {
    const messagesData = fs.readFileSync(MESSAGES_FILE);
    return JSON.parse(messagesData);
  }
  return [];
};

const writeMessages = (messages) => {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const users = readUsers();

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };
    users.push(user);
    writeUsers(users);

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, name: user.name });
  } catch (error) {
    console.error("Error in /api/register:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = readUsers();

    const user = users.find(user => user.email === email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, name: user.name });
  } catch (error) {
    console.error("Error in /api/login:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const users = readUsers();
    const user = users.find(user => user.mail === email);
    if (!user) return res.status(400).json({ message: "user not found" })

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokens = readResetTokens();
    resetTokens.push({ email, token: resetToken, expires: Date.now() + 3600000 }); // 1 hour
    writeResetTokens(resetTokens);

    const resetLink = `http://locolhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: email,
      from: EMAIL_USER,
      subject: 'password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };
    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Password reset link sent successfully' });
      }
    });
  } catch (error) {
    console.error("Error in /api/forgot-password:", error);
    res.status(500).json({ message: 'Internal server error' });

  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const resetTokens = readResetTokens();
    const resetToken = resetTokens.find(t => t.token === token && t.expires > Date.now());
    if (!resetToken) return res.status(400).json({ message: 'Invalid or expired token' });

    const users = readUsers();
    const user = users.find(u => u.email === resetToken.email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    writeUsers(users);

    const updatedTokens = resetTokens.filter(t => t.token !== token);
    writeResetTokens(updatedTokens);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error("Error in /api/reset-password:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (error) {
    console.error("Error in /api/users:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/messages/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = readMessages();
    const filteredMessages = messages.filter(
      msg => (msg.sender === user1 && msg.receiver === user2) || (msg.sender === user2 && msg.receiver === user1)
    );
    res.json(filteredMessages);
  } catch (error) {
    console.error("Error in /api/messages:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/messages', (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    const messages = readMessages();
    const newMessage = { id: Date.now(), sender, receiver, message, timestamp: new Date().toISOString() };
    messages.push(newMessage);
    writeMessages(messages);
    io.emit('message', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in /api/messages:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  try {
    let messages = readMessages();
    messages = messages.filter(msg => msg.id !== parseInt(id, 10));
    writeMessages(messages);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error("Error in /api/messages/:id:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
