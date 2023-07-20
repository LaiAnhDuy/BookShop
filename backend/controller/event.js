const express = require('express');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const router = express.Router();
const {upload} = require('../multer');
const Event = require('../model/event');
const Shop = require('../model/shop');
const httpStatus = require('http-status');
const fs = require('fs');

const {isSeller} = require('../middleware/auth');

router.post(
	'/create-event',
	upload.array('images'),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.body.shopId;
			const shop = await Shop.findById(shopId);
			if (!shop) return next(new ErrorHandler('shop id is invalid'));
			else {
				const imageUrls = req.files.map((file) => file.filename);
				const event = await Event.create({
					...req.body,
					shop,
					images: imageUrls,
				});
				res.status(httpStatus.CREATED).json({success: true, event: event});
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
router.get(
	'/get-all-events-shop/:shopId',
	isSeller,

	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.params.shopId;
			// console.log(shopId);
			// console.log(req.seller._id.toString());
			// if (shopId.toString() != req.seller._id.toString()) {
			// 	return next(new ErrorHandler('You cannot access this shop', 400));
			// }
			const events = await Event.find({shopId: shopId});
			res.status(httpStatus.OK).json({success: true, events});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
router.delete(
	'/delete-shop-event/:id',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const eventId = req.params.id;
			const event = await Event.findById(eventId);
			if (!event) {
				return next(new ErrorHandler('Event not found', 400));
			}
			if (req.seller._id.toString() != event.shopId) {
				return next(
					new ErrorHandler('you do not have the right to delete this event')
				);
			}
			event.images.forEach((image) => {
				fs.unlink(`uploads/${image}`, (err) => {
					if (err) console.log(err);
				});
			});
			await Event.findByIdAndDelete(eventId);
			return res
				.status(201)
				.json({success: true, message: 'Event is deleted successfully'});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
router.get(
	'/get-all-events',
	catchAsyncErrors(async (req, res) => {
		try {
			const events = await Event.find();
			res.status(200).json({success: true, events});
		} catch (error) {
			next(new ErrorHandler(error.message, 500));
		}
	})
);
module.exports = router;
