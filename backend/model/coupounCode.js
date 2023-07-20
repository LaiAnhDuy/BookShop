const mongoose = require('mongoose');
const coupounCodeSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, 'please enter your coupoundCode name'],
	},
	value: {
		type: Number,
		require: true,
	},
	minAmount: {
		type: Number,
	},
	maxAmount: {
		type: Number,
	},
	shopId: {
		type: String,
		require: true,
	},
	selectedProduct: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});
module.exports = mongoose.model('CoupounCode', coupounCodeSchema);
