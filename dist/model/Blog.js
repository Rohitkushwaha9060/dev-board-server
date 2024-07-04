"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCommentModel = exports.BlogModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlogSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tags',
        },
    ],
    categories: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Categories',
        },
    ],
    isPublic: {
        required: true,
        type: Boolean,
        default: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'BlogComments',
        },
    ],
}, {
    timestamps: true,
});
const blogCommentSchema = new mongoose_1.default.Schema({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    blogId: {
        type: String,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.BlogModel = mongoose_1.default.model('Blogs', BlogSchema);
exports.BlogCommentModel = mongoose_1.default.model('BlogComments', blogCommentSchema);
//# sourceMappingURL=Blog.js.map