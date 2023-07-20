const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const {upload} = require('../multer');
const ErrorHandler = require('../utils/ErrorHandler');
const Product = require('../model/product');
const Shop = require('../model/shop');
const Order = require('../model/order');
const status = require('http-status');
const httpStatus = require('http-status');
const fs = require('fs');
const {isSeller, isAuthenticated} = require('../middleware/auth');
const {response} = require('../app');
const product = require('../model/product');

router.post(
	'/create-product',
	upload.array('images'),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.body.shopId;
			const shop = await Shop.findById(shopId);
			if (!shop) return next(new ErrorHandler('shop id is invalid'));
			else {
				const imageUrls = req.files.map((file) => file.filename);
				const product = await Product.create({
					...req.body,
					shop,
					images: imageUrls,
				});
				res.status(status.CREATED).json({success: true, product: product});
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.post(
	'/create-multiple-products',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.seller._id;
			const shop = await Shop.findById(shopId);
			if (!shop) return next(new ErrorHandler('shop id is invalid'));

			const {products} = req.body;
			console.log(products);
			products.shift();
			const productsdata = products.map((product) => ({
				name: product[0],
				description: product[1],
				category: product[2],
				originalPrice: product[3],
				discountPrice: product[4],
				stock: product[5],
				images: product[6].trim().replace(/\s\s+/g, ' ').split(' '),
				shop,
				shopId,
			}));
			await Product.insertMany(productsdata);
			return res.status(201).json({
				success: true,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.get(
	'/get-all-products-shop/:shopId',
	isSeller,

	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.params.shopId;
			// console.log(shopId);
			// console.log(req.seller._id.toString());
			// if (shopId.toString() != req.seller._id.toString()) {
			// 	return next(new ErrorHandler('You cannot access this shop', 400));
			// }
			const products = await Product.find({shopId: shopId}).sort('-createdAt');
			res.status(httpStatus.OK).json({success: true, products: products});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
router.delete(
	'/delete-shop-product/:id',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const productId = req.params.id;
			const product = await Product.findById(productId);
			if (!product) {
				return next(new ErrorHandler('Product not found', 400));
			}
			if (req.seller._id.toString() != product.shopId) {
				return next(
					new ErrorHandler('you do not have the right to delete this product')
				);
			}
			product.images.forEach((image) => {
				fs.unlink(`uploads/${image}`, (err) => {
					if (err) console.log(err);
				});
			});
			await Product.findByIdAndDelete(productId);
			return res
				.status(201)
				.json({success: true, message: 'Product deleted successfully'});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
router.get(
	'/get-product/:id',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const id = req.params.id;
			// console.log(shopId);
			// console.log(req.seller._id.toString());
			// if (shopId.toString() != req.seller._id.toString()) {
			// 	return next(new ErrorHandler('You cannot access this shop', 400));
			// }
			const product = await Product.findById(id);
			res.status(httpStatus.OK).json({success: true, product: product});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
router.get(
	'/get-all-products',
	catchAsyncErrors(async (req, res, next) => {
		// console.log(3);
		try {
			const products = await Product.find().sort({createdAt: -1});

			res.status(201).json({
				success: true,
				products,
			});
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);
router.get(
	'/get-all-products-page',
	catchAsyncErrors(async (req, res, next) => {
		const page = req.query.page ? req.query.page : 1;
		const perpage = 10;
		// console.log(req.query.category);
		const match = req.query.category ? {category: req.query.category} : {};
		// console.log(match);
		try {
			const [result] = await Product.aggregate([
				{$match: match},
				{
					$facet: {
						products: [
							{$sort: {createdAt: -1}},
							{$skip: (page - 1) * perpage},
							{$limit: perpage},
						],
						totalCount: [{$count: 'count'}],
					},
				},
			]);

			const {products, totalCount} = result;
			// console.log(totalCount);
			return res.status(200).json({
				products,
				totalPages: Math.ceil(totalCount[0]?.count / perpage),
				currentPage: page,
			});
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);
router.put(
	'/create-new-review',
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const {user, rating, comment, productId, orderId} = req.body;
			const product = await Product.findOne({_id: productId});
			const isReviewed = product.reviews.find(
				(review) => review.user._id == user._id
			);
			if (isReviewed) {
				isReviewed.user = user;
				isReviewed.rating = rating;
				isReviewed.comment = comment;
			} else {
				product.reviews.push({user, rating, comment, productId});
			}
			const avg = product.reviews.reduce(
				(sum, review) => (sum += review.rating),
				0
			);
			product.ratings = avg / product.reviews.length;
			await product.save({validateBeforeSave: false});
			await Order.findOneAndUpdate(
				{_id: orderId},
				{$set: {'cart.$[element].isReviewed': true}},
				{arrayFilters: [{'element._id': productId}], returnDocument: 'after'}
			);
			res.status(200).json({
				success: true,
				message: 'reviews updated successfully',
			});
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);
module.exports = router;
