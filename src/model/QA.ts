import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema(
    {
        question: {
            type: String,
        },
        answers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Answer',
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
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
            ref: 'Users',
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const answerSchema = new mongoose.Schema(
    {
        answer: {
            type: String,
        },
        questionId: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const QAModel = mongoose.model('QA', qaSchema);
export const AnswerModel = mongoose.model('Answer', answerSchema);
