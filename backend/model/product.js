const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please enter your product name'],
	},
	description: {
		type: String,
		required: [true, 'please enter your product description'],
	},
	category: {
		type: String,
		required: [true, 'please enter your product category'],
	},
	// tags: {
	// 	type: String,
	// 	required: [true, 'please enter your product tags'],
	// },
	originalPrice: {
		type: Number,
	},
	discountPrice: {
		type: Number,
		required: [true, 'please enter your product discount price'],
	},
	stock: {
		type: Number,
		required: [true, 'please enter your product stock'],
	},
	images: [
		{
			type: String,
		},
	],
	shopId: {
		type: String,
		required: true,
	},
	shop: {
		type: Object,
		required: true,
	},
	sold_out: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	ratings: {type: Number},
	reviews: [
		{
			user: Object,
			productId: String,
			// orderId: String,
			rating: Number,
			comment: String,
			createdAt: {
				type: Date,
				default: new Date(),
			},
		},
	],
});
module.exports = mongoose.model('Product', productSchema);
