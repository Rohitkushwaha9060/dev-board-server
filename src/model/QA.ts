import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
        },
        question: {
            type: String,
        },
        answers: [
            {
                type: String,
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tags',
            },
        ],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export const QAModel = mongoose.model('QA', qaSchema);
