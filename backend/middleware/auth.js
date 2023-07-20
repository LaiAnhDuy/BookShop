const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Shop = require('../model/shop');
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
	// console.log(req.headers.cookie?.split(';'));
	const {token} = req.cookies;

	if (!token) {
		return next(new ErrorHandler('Please login to continue', 401));
	}
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	if (decoded) {
		req.user = await User.findById(decoded.id);
		next();
	} else {
		return next(new ErrorHandler('Please login to continue', 401));
	}
	// console.log(decoded);
});
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
	const {seller_token} = req.cookies;

	if (!seller_token) {
		return next(new ErrorHandler('Please login to continue', 400));
	}
	const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);
	if (decoded) {
		req.seller = await Shop.findById(decoded.id);
		next();
	} else return next(new ErrorHandler('Please login to continue', 400));
});
