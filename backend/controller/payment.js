const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const httpStatus = require('http-status');
const {isSeller} = require('../middleware/auth');
const Shop = require('../model/shop');
const CoupounCode = require('../model/coupounCode');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const calculateOrderAmount = (items) => {
// 	// Replace this constant with a calculation of the order's amount
// 	// Calculate the order total on the server to prevent
// 	// people from directly manipulating the amount on the client
// 	return 1400;
// };
router.post(
	'/process',
	catchAsyncErrors(async (req, res) => {
		const {items} = req.body;

		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount: req.body.amount,
			currency: 'usd',
			// automatic_payment_methods: {
			// 	enabled: true,
			// },
			metadata: {integration_check: 'accept_a_payment'},
		});

		res.send({
			success: true,
			client_secret: paymentIntent.client_secret,
		});
	})
);
router.get('/stripeapikey', (req, res) =>
	res.status(200).json({
		stripeapikey: process.env.STRIPE_API_KEY,
	})
);
module.exports = router;
