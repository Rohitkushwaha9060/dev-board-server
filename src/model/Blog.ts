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
            url: String,
            public_id: String,
        },

        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tags',
            },
        ],

        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Categories',
            },
        ],

        isPublic: {
            required: true,
            type: Boolean,
            default: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            },
        ],

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BlogComments',
            },
        ],
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
            ref: 'Users',
        },
        blogId: {
            type: String,
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const BlogModel = mongoose.model('Blogs', BlogSchema);
export const BlogCommentModel = mongoose.model(
    'BlogComments',
    blogCommentSchema
);
