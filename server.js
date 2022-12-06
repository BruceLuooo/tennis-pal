const express = require('express');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
var cors = require('cors');
const { handleError } = require('./middleware/errorMiddleware');
const { notFoundMiddleware } = require('./middleware/not-found');
const socket = require('socket.io');
// const { auth } = require('./middleware/auth');
const path = require('path');

const app = express();

//connect to database
connectDB();

//middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/allUsers', require('./routes/allUsersRoutes'));
app.use('/api/allCourts', require('./routes/allCourtsRoutes'));
app.use('/api/messages', require('./routes/allMessagesRoutes'));

app.use(handleError);
app.use(notFoundMiddleware);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client', 'build')));

	app.get('/*', function (req, res) {
		res.sendFile(path.join(__dirname + './client/build/index.html'));
	});
}

const server = app.listen(PORT, () =>
	console.log(`server started on port ${PORT}`),
);

const io = socket(server, {
	cors: {
		origin: 'https://tennis-pal.herokuapp.com',
		credentials: true,
	},
});

global.onlineUsers = new Map();

io.on('connection', socket => {
	global.chatSocket = socket;
	socket.on('add-user', userId => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on('send-msg', data => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('msg-recieve', data.message);
		}
	});
});
