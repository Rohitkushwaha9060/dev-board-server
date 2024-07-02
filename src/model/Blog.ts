import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        image: {
            type: {
                url: String,
                public_id: String,
            },
        },

        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag',
            },
        ],

        isPublic: {
            required: true,
            type: Boolean,
            default: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const blogCommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export const BlogModel = mongoose.model('Blogs', BlogSchema);
export const BlogCommentModel = mongoose.model(
    'BlogComments',
    blogCommentSchema
);
