const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: String,
		},
		images: [
			{
				type: String,
			},
		],
		content: {
			type: String,
		},
		sender: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Message', messageSchema);
