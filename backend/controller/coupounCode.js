const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const httpStatus = require('http-status');
const {isSeller} = require('../middleware/auth');
const Shop = require('../model/shop');
const CoupounCode = require('../model/coupounCode');

router.post(
	'/create-coupoun-code',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const existCoupounCode = await CoupounCode.findOne({name: req.body.name});
			// console.log(existCoupounCode);
			if (existCoupounCode) {
				return next(new ErrorHandler('Coupoun Code already exists'));
			}

			const shopId = req.body.shopId;
			const shop = await Shop.findById(shopId);
			if (!shop) return next(new ErrorHandler('shop id is invalid'));

			const coupounCode = await CoupounCode.create(req.body);
			res.status(httpStatus.CREATED).json({success: true, coupounCode});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.get(
	'/get-all-coupoun-shop/:shopId',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.params.shopId;

			const coupouns = await CoupounCode.find({shopId: shopId});
			res.status(httpStatus.OK).json({success: true, coupouns});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
// router.delete(
// 	'/delete-shop-product/:id',
// 	isSeller,
// 	catchAsyncErrors(async (req, res, next) => {
// 		try {
// 			const productId = req.params.id;
// 			const product = await Product.findById(productId);
// 			if (!product) {
// 				return next(new ErrorHandler('Product not found', 400));
// 			}
// 			if (req.seller._id.toString() != product.shopId) {
// 				return next(
// 					new ErrorHandler('you do not have the right to delete this product')
// 				);
// 			}
// 			product.images.forEach((image) => {
// 				fs.unlink(`uploads/${image}`, (err) => {
// 					if (err) console.log(err);
// 				});
// 			});
// 			await Product.findByIdAndDelete(productId);
// 			return res
// 				.status(201)
// 				.json({success: true, message: 'Product deleted successfully'});
// 		} catch (error) {
// 			next(new ErrorHandler(error.message, 500));
// 		}
// 	})
// );
router.get(
	'/get-coupoun/:name',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const coupoun = await CoupounCode.findOne({name: req.params.name});
			res.status(200).json({success: true, coupounCode: coupoun});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
module.exports = router;
