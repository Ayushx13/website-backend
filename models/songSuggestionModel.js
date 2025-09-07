import mongoose from "mongoose";

const songSuggestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Song suggestion must belong to a user']
    },
    songLinks: {
        type: [String],
        validate: [
            {
                validator: function(links) {
                    return links.length <= 3;
                },
                message: 'You can only suggest up to 3 songs'
            },
            {
                validator: function(links) {
                    return links.every(link => 
                        link.match(/^(https?:\/\/)?(open\.)?spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+/)
                    );
                },
                message: 'Please provide valid Spotify links'
            }
        ],
        required: [true, 'Please provide at least one song link']
    },
});

// Prevent user from submitting more than once
songSuggestionSchema.index({ user: 1 }, { unique: true });

const SongSuggestion = mongoose.model('SongSuggestion', songSuggestionSchema);

export default SongSuggestion;
