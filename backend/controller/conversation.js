const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Conversation = require('../model/conversation');
const {isSeller} = require('../middleware/auth');

router.post(
	'/create-new-conversation',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const {groupTitle, userId, sellerId} = req.body;
			let conversation = await Conversation.findOne({
				groupTitle,
			});
			if (!conversation) {
				conversation = await Conversation.create({
					members: [userId, sellerId],
					groupTitle,
				});
			}

			res.status(200).json({
				success: true,
				conversation,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//get seller conversation

router.get(
	'/get-all-conversations-seller/:id',
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const {id} = req.params;
			const conversations = await Conversation.find({
				'members.1': id,
			}).sort({updatedAt: -1, createdAt: -1});
			return res.status(200).json({
				success: true,
				conversations,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//get user conversation
module.exports = router;
