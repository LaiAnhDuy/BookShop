const express = require('express');
const app = express();
const ErrorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
};
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/', express.static('uploads/'));

//config
if (process.env.NODE_ENV !== 'PRODUCTION') {
	require('dotenv').config({
		path: 'backend/config/.env',
	});
}

//import routes
const user = require('./controller/user');
const shop = require('./controller/shop');
const product = require('./controller/product');
const event = require('./controller/event');
const coupounCode = require('./controller/coupounCode');
const payment = require('./controller/payment');
const order = require('./controller/order');
const conversation = require('./controller/conversation');

app.use('/api/v2/user', user);
app.use('/api/v2/shop', shop);
app.use('/api/v2/product', product);
app.use('/api/v2/event', event);
app.use('/api/v2/coupounCode', coupounCode);
app.use('/api/v2/payment', payment);
app.use('/api/v2/order', order);
app.use('/api/v2/conversation', conversation);

//error handler
app.use(ErrorHandler);

module.exports = app;
