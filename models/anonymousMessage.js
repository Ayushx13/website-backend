import mongoose from "mongoose";

const anonymousMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Message must belong to a user']
    },
    userName: {
        type: String,
        required: [true, 'User name is required']
    },
    message: {
        type: String,
        required: [true, 'Please provide the message!'],
        trim: true,
        validate: {
            validator: function(message) {
                // Split by spaces and count words
                const wordCount = message.trim().split(/\s+/).length;
                return wordCount <= 100;
            },
            message: 'Message cannot exceed 100 words'
        }
    },
});


const AnonymousMessage = mongoose.model('AnonymousMessage', anonymousMessageSchema);

export default AnonymousMessage;