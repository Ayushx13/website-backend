import SongSuggestion from "../models/songSuggestionModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Submit song suggestions
export const submitSongSuggestions = catchAsync(async (req, res, next) => {
    const { songLinks } = req.body;

    // Validate songLinks array
    if (!Array.isArray(songLinks) || songLinks.length === 0 || songLinks.length > 3) {
        return next(new AppError('Please provide 1-3 Spotify song links', 400));
    }

    // Check if user has already submitted suggestions
    const existingSuggestions = await SongSuggestion.findOne({ user: req.user.id });
    if (existingSuggestions) {
        return next(new AppError('You have already submitted your song suggestions', 400));
    }

    // Create song suggestions
    const songSuggestion = await SongSuggestion.create({
        user: req.user.id,
        songLinks
    });

    res.status(201).json({
        status: 'success',
        data: {
            songSuggestion
        }
    });
});

// Get user's song suggestions
export const getMySongSuggestions = catchAsync(async (req, res, next) => {
    const suggestions = await SongSuggestion.findOne({ user: req.user.id });

    if (!suggestions) {
        return next(new AppError('You have not submitted any song suggestions yet', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            suggestions
        }
    });
});

// Admin only: Get all song suggestions
export const getAllSongSuggestions = catchAsync(async (req, res, next) => {
    const suggestions = await SongSuggestion.find()
        .populate({
            path: 'user',
            select: 'name email'
        });

    // Get all unique songs
    const uniqueSongs = new Set();
    suggestions.forEach(suggestion => {
        suggestion.songLinks.forEach(link => uniqueSongs.add(link));
    });

    // Convert suggestions to a format with both unique songs and user submissions
    res.status(200).json({
        status: 'success',
        results: {
            totalSubmissions: suggestions.length,
            uniqueSongs: uniqueSongs.size
        },
        data: {
            uniqueSongs: Array.from(uniqueSongs),
            allSubmissions: suggestions
        }
    });
});
