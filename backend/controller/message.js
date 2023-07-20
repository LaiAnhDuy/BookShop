const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Conversation = require('../model/conversation');
const {isSeller} = require('../middleware/auth');
const {upload} = require('../multer');
const Message = require('../model/message');
//create a message

router.post(
	'/create-new-message',
	upload.array('images'),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const files = req.files;
			const images = [];
			for (const file of files) {
				images.push(file.filename);
			}
			const {conversationId, sender, content} = req.body;
			const message = await Message.create({
				conversationId,
				sender,
				content,
				images,
			});
			return res.status(200).json({
				success: true,
				message,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message || 'internal server error', 500));
		}
	})
);
