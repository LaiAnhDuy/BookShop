const express = require('express');
const router = express.Router();
const ErrorHandler = require('../utils/ErrorHandler');
const fs = require('fs');
const sendMail = require('../utils/sendMail.js');
const jwt = require('jsonwebtoken');
const {upload} = require('../multer');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken.js');
const Shop = require('../model/shop');
const sendShopToken = require('../utils/shopToken');
const {isSeller} = require('../middleware/auth');
const shop = require('../model/shop');
const httpStatus = require('http-status');
router.post(
	'/create-shop',
	upload.single('file'),
	catchAsyncErrors(async (req, res, next) => {
		const {name, email, phoneNumber, password, address, zipCode} = req.body;
		const shopEmail = await Shop.findOne({email});
		if (shopEmail) {
			const filePath = req.file?.path;
			fs.unlink(filePath, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({message: 'Error deleting file'});
				}
			});
			return next(new ErrorHandler('Shop already exists', 400));
		}
		// console.log(req.file);
		const filename = req.file?.filename;
		const fileUrl = filename;
		const shop = {
			name: name,
			email: email,
			password: password,
			avatar: fileUrl,
			address: address,
			phoneNumber: phoneNumber,
			zipCode: zipCode,
		};

		const activationToken = createActivationToken(shop);

		const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

		try {
			await sendMail({
				email: shop.email,
				subject: 'Activate your shop',
				message: `hello ${shop.name}, please click the link below to activate your shop: \n ${activationUrl}`,
			});
			res.status(201).json({
				success: true,
				message: `please check your email : ${shop.email} to activate your account`,
			});
		} catch (err) {
			return next(new ErrorHandler(err.message, 500));
		}

		// console.log(shop);
		// const newUser = await shop.create(shop);
	})
);
const createActivationToken = (shop) => {
	return jwt.sign(shop, process.env.ACTIVATION_SECRET, {
		expiresIn: '1h',
	});
};
router.post(
	'/activation',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const {activation_token} = req.body;
			const newShop = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
			if (!newShop) {
				return next(new ErrorHandler('Invalid activation token', 400));
			}
			const {name, email, password, avatar, address, phoneNumber, zipCode} =
				newShop;
			let shop = await Shop.findOne({email});
			if (shop) {
				return next(new ErrorHandler('Shop already exists', 400));
			}
			shop = await Shop.create({
				name,
				email,
				password,
				avatar,
				address,
				phoneNumber,
				zipCode,
			});
			sendToken(shop, 201, res);
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
router.post(
	'/login-shop',
	catchAsyncErrors(async (req, res, next) => {
		try {
			// console.log(req.cookies);
			const {email, password} = req.body;
			if (!email || !password) {
				return next(new ErrorHandler('Please provide the all fields', 400));
			}
			const user = await Shop.findOne({email}).select('+password');
			if (!user) {
				return next(new ErrorHandler("Seller doesn't exist!", 400));
			}

			const isPasswordMatched = await user.comparePassword(password);
			if (!isPasswordMatched) {
				return next(new ErrorHandler('Password mismatch', 400));
			}
			sendShopToken(user, 201, res);
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
//load seller
router.get(
	'/getSeller',

	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		const seller = await Shop.findById(req.seller._id);
		if (!seller) {
			return next(new ErrorHandler('Seller does not exist', 404));
		} else
			return res.status(200).json({
				success: true,
				seller,
			});
	})
);

//logout from shop
router.get(
	'/logout',
	catchAsyncErrors(async (req, res, next) => {
		try {
			res
				.cookie('seller_token', null, {
					expires: new Date(),
					htthOnly: true,
				})
				.status(201)
				.json({success: true, message: 'Logout successful'});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.get(
	'/get-shop-info/:id',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shoId = req.params.id;
			let shop = await Shop.findById(shoId, {
				email: false,
				resetPasswordTime: false,
				resetPasswordToken: false,
			});
			// let shop = await Shop.findById(shoId).select({
			// 	email: false,
			// 	resetPasswordTime: false,
			// 	resetPasswordToken: false,
			// });
			if (!shop) return next(new ErrorHandler('Shop not found', 404));

			return res.status(httpStatus.OK).json({success: true, shop});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

module.exports = router;
