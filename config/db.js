const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDb Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`error: shit ain't connecting to mongoDB`);
		process.exit(1);
	}
};

module.exports = connectDB;
