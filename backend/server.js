const app = require('./app.js');
const connectDatabase = require('./db/Database.js');

//handling uncaught exceptions
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`);
	console.log('Shutting down the server for handling uncaught exceptions');
});

//connect to database
connectDatabase();

//create server
const server = app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
	console.log(`Shutting down the server for ${err.message}`);
	console.log(`shutting down the server for unhandle promise rejection`);
	server.close(() => {
		process.exit(1);
	});
});
