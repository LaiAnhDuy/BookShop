const express = require('express');
const router = express.Router();
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const {isAuthenticated, isSeller} = require('../middleware/auth');
const Order = require('../model/order');
const Product = require('../model/product');

router.post(
	'/create-order',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const orders = req.body;
			console.log(orders);

			await Order.insertMany(orders);
			res.status(201).json({success: true});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//get all orders by user
router.get(
	'/get-all-orders/:userId',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const orders = await Order.find({'user._id': req.params.userId}).sort({
				createdAt: -1,
			});
			res.status(200).json({success: true, orders});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//get all orders by seller
router.get(
	'/get-seller-orders/:shopId',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const orders = await Order.find({
				'cart.0.shopId': req.params.shopId,
			}).sort({
				createdAt: -1,
			});
			res.status(200).json({success: true, orders});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//update order status for seller
router.put(
	'/update-order-status/:id',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		const orderStatuses = [
			'Processing',
			'Transferred to delivery partner',
			'Shipping',
			'Received',
			'On the way',
			'Delivered',
		];
		try {
			const order = await Order.findOne({_id: req.params.id});
			console.log(order);
			console.log(order.cart);

			if (!order) {
				return next(new ErrorHandler('order not found', 404));
			}

			if (order.status == 'Delivered') {
				return next(new ErrorHandler('Cannot update this order status', 400));
			}
			order.status = orderStatuses[orderStatuses.indexOf(order.status) + 1];
			if (order.status === 'Delivered') {
				order.deliveredAt = Date.now();
				order.paymentInfo.status = 'Succeeded';
			}
			await order.save({validateBeforeSave: false});
			if (req.body.status === 'Transferred to delivery partner') {
				order.cart.forEach(async (item) => {
					const product = await Product.findById(item._id);
					product.stock -= item.qty;
					product.sold_out += item.qty;
					await product.save({validateBeforeSave: false});
				});
			}
			return res.status(200).json({
				success: true,
				order: order,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//request to refund order
router.put(
	'/order-refund/:id',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id);
			if (!order) {
				return next(new ErrorHandler('Order not found', 404));
			}
			if (order.status != 'Delivered') {
				return next(new ErrorHandler('Cannot refund this order', 400));
			}
			order.status = 'Processing refund';
			await order.save({validateBeforeSave: false});
			res.status(200).json({
				success: true,
				order,
				message: 'Order Refund Request successfully',
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.put(
	'/order-refund-success/:id',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id);
			if (!order) {
				return next(new ErrorHandler('Order not found', 404));
			}
			order.status = req.body.status;
			await order.save({validateBeforeSave: false});
			res.status(200).json({
				success: true,
				message: 'Order Refund successfull!',
			});
			for (item of order.cart) {
				const product = await Product.findById(item._id);
				product.stock += item.qty;
				product.sold_out -= item.qty;
				await product.save({validateBeforeSave: false});
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

module.exports = router;
