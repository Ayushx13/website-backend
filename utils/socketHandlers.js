import Vote from './../models/voteModel.js';
import Candidate from './../models/candidateModel.js';

export const setupSocketHandlers = (io) => {
    io.on('connection', async (socket) => {
        console.log('Admin connected');

        // Send initial vote counts when admin connects
        try {
            const candidates = await Candidate.find()
                .select('name category vote')
                .sort({ category: 1, name: 1 });

            socket.emit('initialVoteCounts', candidates);
        } catch (error) {
            console.error('Error fetching initial vote counts:', error);
        }

        // Listen for specific category updates request
        socket.on('requestCategoryStats', async (category) => {
            try {
                const categoryCandidates = await Candidate.find({ category })
                    .select('name vote')
                    .sort('name');
                
                socket.emit('categoryStats', {
                    category,
                    candidates: categoryCandidates
                });
            } catch (error) {
                console.error(`Error fetching ${category} stats:`, error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Admin disconnected');
        });
    });
};
