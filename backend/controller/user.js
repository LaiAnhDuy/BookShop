const express = require('express');
const router = express.Router();
const {upload} = require('../multer.js');
const User = require('../model/user.js');
const ErrorHandler = require('../utils/ErrorHandler');
const fs = require('fs');
const sendMail = require('../utils/sendMail.js');
const jwt = require('jsonwebtoken');

const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const sendToken = require('../utils/jwtToken.js');
const {isAuthenticated} = require('../middleware/auth.js');
const user = require('../model/user.js');

router.post(
	'/create-user',
	upload.single('file'),
	catchAsyncErrors(async (req, res, next) => {
		const {name, email, password} = req.body;
		const userEmail = await User.findOne({email});
		if (userEmail) {
			const filePath = req.file?.path;
			fs.unlink(filePath, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({message: 'Error deleting file'});
				}
			});
			return next(new ErrorHandler('User already exists', 400));
		}
		// console.log(req.file);
		const filename = req.file?.filename;
		const fileUrl = filename;
		const user = {
			name: name,
			email: email,
			password: password,
			avatar: fileUrl,
		};

		const activationToken = createActivationToken(user);

		const activationUrl = `http://localhost:3000/activation/${activationToken}`;

		try {
			await sendMail({
				email: user.email,
				subject: 'Activate your account',
				message: `hello ${user.name}, please click the link below to activate your account: \n ${activationUrl}`,
			});
			res.status(201).json({
				success: true,
				message: `please check your email : ${user.email} to activate your account`,
			});
		} catch (err) {
			return next(new ErrorHandler(err.message, 500));
		}

		// console.log(user);
		// const newUser = await User.create(user);
	})
);
const createActivationToken = (user) => {
	return jwt.sign(user, process.env.ACTIVATION_SECRET, {
		expiresIn: '5m',
	});
};

router.post(
	'/activation',
	catchAsyncErrors(async (req, res, next) => {
		try {
			const {activation_token} = req.body;
			const newUser = await jwt.verify(
				activation_token,
				process.env.ACTIVATION_SECRET
			);
			if (!newUser) {
				return next(new ErrorHandler('Invalid activation token', 400));
			}
			const {name, email, password, avatar} = newUser;
			let user = await User.findOne({email});
			if (user) {
				return next(new ErrorHandler('User already exists', 400));
			}
			user = await User.create({name, email, password, avatar});
			sendToken(user, 201, res);
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.post(
	'/login-user',
	catchAsyncErrors(async (req, res, next) => {
		try {
			// console.log(req.cookies);
			const {email, password} = req.body;
			if (!email || !password) {
				return next(new ErrorHandler('Please provide the all fields', 400));
			}
			const user = await User.findOne({email}).select('+password');
			if (!user) {
				return next(new ErrorHandler("User doesn't exist!", 400));
			}

			const isPasswordMatched = await user.comparePassword(password);
			if (!isPasswordMatched) {
				return next(new ErrorHandler('Password mismatch', 400));
			}
			sendToken(user, 201, res);
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

//get user
router.get(
	'/getuser',
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		// console.log(1);

		try {
			const user = await User.findById(req.user._id);
			if (!user) {
				return next(new ErrorHandler('User not found', 400));
			}
			res.status(200).json({
				success: true,
				user,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

router.get(
	'/logout',
	catchAsyncErrors(async (req, res, next) => {
		try {
			res
				.cookie('token', null, {
					expires: new Date(),
					htthOnly: true,
				})
				.status(201)
				.json({success: true, message: 'Logout successful'});
		} catch (e) {
			return next(new ErrorHandler(err.message, 500));
		}
	})
);
router.put(
	'/update-user-info',
	catchAsyncErrors(async (req, res, next) => {
		console.log(req.body);
		try {
			const {name, email, password, phoneNumber} = req.body;
			let user = await User.findOne({email: email}).select('+password');
			if (user) {
				const comparePassword = await user.comparePassword(password);
				if (comparePassword) {
					user.phoneNumber = phoneNumber;
					user.name = name;
					await user.save();
					user = user.toObject();
					delete user.password;
					return res.status(202).json({
						success: true,
						user: user,
					});
				} else {
					return next(new ErrorHandler('Invalid password', 400));
				}
			} else {
				return next(new ErrorHandler('User not found', 400));
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
router.put(
	'/update-avatar',
	isAuthenticated,
	upload.single('image'),
	catchAsyncErrors(async (req, res, next) => {
		try {
			// console.log(req.file);
			const avatar = req.file.filename;
			const user = req.user;
			fs.unlink(`uploads/${user.avatar}`, (err) => {
				if (err) console.log(err);
			});
			user.avatar = avatar;
			await user.save();
			return res.status(202).json({
				success: true,
				user: user,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
router.put(
	'/add-user-addresses',
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const address = req.body;
			const user = await User.findById(req.user._id);
			const sameTypeAddress = user.addresses.find(
				(item) => item.addressType == address.addressType
			);
			if (sameTypeAddress) {
				return next(
					new ErrorHandler(`${req.body.addressType} address already exists`, 400)
				);
			}
			user.addresses.push(address);
			await user.save();
			return res.status(202).json({
				success: true,
				user: user,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
router.delete(
	'/delete-user-address/:id',
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const userId = req.user._id;
			const addressId = req.params.id;
			console.log(2);
			await User.updateOne(
				{_id: userId},
				{
					$pull: {
						addresses: {_id: addressId},
					},
				}
			);
			const user = await User.findById(userId);
			res.status(200).json({success: true, user: user});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
router.put(
	'/update-user-password',
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const {oldPassword, newPassword, confirmPassword} = req.body;
			const user = await User.findById(req.user._id).select('password');
			const isCorrectPassword = user.comparePassword(oldPassword);
			if (!isCorrectPassword) {
				return next(new ErrorHandler('Old password is incorrect', 400));
			}
			if (newPassword !== confirmPassword) {
				return next(
					new ErrorHandler("Password doesn't matched with each other!", 400)
				);
			}
			user.password = newPassword;
			await user.save();
			res.status(200).json({
				success: true,
				message: 'password update successfully',
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
module.exports = router;
