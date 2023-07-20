const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const shopSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter your shop name'],
	},
	email: {
		type: String,
		required: [true, 'Please enter your shop email'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please enter your shop password'],
		minLength: [6, 'password must be at least 6 characters'],
		select: false,
	},
	description: {
		type: String,
	},
	phoneNumber: {
		type: Number,
		required: [true, 'Please enter your shop phone number'],
	},
	role: {
		type: String,
		default: 'Seller',
	},
	avatar: {
		type: String,
		required: [true, 'Please enter your shop avatar'],
	},
	zipCode: {
		type: Number,
		required: true,
	},
	address: {type: String, required: true},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	resetPasswordToken: String,
	resetPasswordTime: Date,
});
shopSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});
// jwt token
shopSchema.methods.getJwtToken = function () {
	return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};

// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('Shop', shopSchema);
