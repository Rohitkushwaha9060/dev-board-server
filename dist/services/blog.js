"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = void 0;
const model_1 = require("../model");
const utils_1 = require("./utils");
class BlogService {
    // create blog
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageUrl = null;
            let imagePublicId = null;
            const blog = yield model_1.BlogModel.findOne({
                slug: utils_1.utilsService.slugifyData(data.title),
            });
            if (blog) {
                return {
                    statusCode: 400,
                    message: 'Blog already exist',
                };
            }
            // upload image
            if (data.image) {
                // check extension
                const extName = data.image.originalname.split('.').pop();
                if (!['png', 'jpg', 'jpeg', 'webp'].includes(extName)) {
                    return {
                        statusCode: 400,
                        message: 'Invalid image extension',
                    };
                }
                const cloudinaryRes = yield utils_1.utilsService.uploadToCloudinary(data.image.path);
                imageUrl = cloudinaryRes.secure_url;
                imagePublicId = cloudinaryRes.public_id;
            }
            // create blog
            const newBlog = yield new model_1.BlogModel({
                slug: utils_1.utilsService.slugifyData(data.title),
                title: data.title,
                content: data.content,
                image: {
                    url: imageUrl,
                    public_id: imagePublicId,
                },
                tags: data.tags,
                categories: data.categories,
                author: data.author,
            });
            // save blog
            yield newBlog.save();
            return {
                statusCode: 201,
                message: 'blog created',
                data: newBlog,
            };
        });
    }
    // update blog by id
    updateBlogById(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            let imageUrl = null;
            let imagePublicId = null;
            // check if blog exist
            const blog = yield model_1.BlogModel.findById(data.id).populate('author');
            if (!blog) {
                return {
                    statusCode: 400,
                    message: 'Blog not found',
                };
            }
            //@ts-ignore
            if (((_a = blog.author) === null || _a === void 0 ? void 0 : _a.id) != data.userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            if ((_b = blog.image) === null || _b === void 0 ? void 0 : _b.url) {
                imageUrl = ((_c = blog.image) === null || _c === void 0 ? void 0 : _c.url) || null;
                imagePublicId = ((_d = blog.image) === null || _d === void 0 ? void 0 : _d.public_id) || null;
            }
            if (data.image) {
                // check extension
                const extName = data.image.originalname.split('.').pop();
                if (!['png', 'jpg', 'jpeg', 'webp'].includes(extName)) {
                    return {
                        statusCode: 400,
                        message: 'Invalid image extension',
                    };
                }
                const cloudinaryRes = yield utils_1.utilsService.uploadToCloudinary(data.image.path);
                if ((_e = blog.image) === null || _e === void 0 ? void 0 : _e.url) {
                    yield utils_1.utilsService.deleteFromCloudinary((_f = blog.image) === null || _f === void 0 ? void 0 : _f.public_id);
                }
                imageUrl = cloudinaryRes.secure_url;
                imagePublicId = cloudinaryRes.public_id;
            }
            // update blog
            const newBlog = yield model_1.BlogModel.findByIdAndUpdate(data.id, {
                slug: utils_1.utilsService.slugifyData(data.title),
                tags: data.tags,
                categories: data.categories,
                title: data.title,
                content: data.content,
                image: {
                    url: imageUrl,
                    public_id: imagePublicId,
                },
            }, { new: true });
            return {
                statusCode: 200,
                message: 'blog updated',
                data: newBlog,
            };
        });
    }
    // get blogs
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                if (!query.q) {
                    query.q = '';
                }
                const tags = yield model_1.BlogModel.distinct('tags');
                const cats = yield model_1.BlogModel.distinct('categories');
                query.tags = query.tags != '' ? query.tags.split(',') : [...tags];
                query.cats = query.cats != '' ? query.cats.split(',') : [...cats];
                const totalBlog = yield model_1.BlogModel.countDocuments({
                    $or: [
                        { title: { $regex: query.q, $options: 'i' } },
                        { content: { $regex: query.q, $options: 'i' } },
                        { slug: { $regex: query.q, $options: 'i' } },
                    ],
                })
                    .where('isPublic', true)
                    .where('tags')
                    .in(query.tags)
                    .where('categories')
                    .in(query.cats);
                const blogs = yield model_1.BlogModel.find({
                    $or: [
                        { title: { $regex: query.q, $options: 'i' } },
                        { content: { $regex: query.q, $options: 'i' } },
                        { slug: { $regex: query.q, $options: 'i' } },
                    ],
                })
                    .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                })
                    .populate({
                    path: 'tags',
                    select: {
                        name: 1,
                    },
                })
                    .populate({
                    path: 'categories',
                    select: {
                        name: 1,
                    },
                })
                    .where('isPublic', true)
                    .where('tags')
                    .in(query.tags)
                    .where('categories')
                    .in(query.cats)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (blogs.length === 0 && totalBlog === 0) {
                    return {
                        statusCode: 404,
                        message: 'Blogs not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'get blogs success',
                    data: {
                        blogs: blogs,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalBlog / limit)
                            ? page + 1
                            : null,
                        totalBlog: totalBlog,
                        totalPages: Math.ceil(totalBlog / limit),
                    },
                };
            }
            else {
                const blogs = yield model_1.BlogModel.find({ isPublic: true })
                    .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                    },
                })
                    .populate({
                    path: 'tags',
                    select: {
                        name: 1,
                    },
                })
                    .populate({
                    path: 'categories',
                    select: {
                        name: 1,
                    },
                });
                if (blogs.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Blogs not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'get blogs success',
                    data: {
                        blogs: blogs,
                        totalBlog: blogs.length,
                    },
                };
            }
        });
    }
    // get all blogs by author
    getAllBlogsByAuthor(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                if (!query.q) {
                    query.q = '';
                }
                const tags = yield model_1.BlogModel.distinct('tags');
                const cats = yield model_1.BlogModel.distinct('categories');
                query.tags =
                    query.tags != '' || query.tags != undefined ? [...tags] : [];
                query.cats =
                    query.cats != '' || query.cats != undefined ? [...cats] : [];
                const totalBlog = yield model_1.BlogModel.countDocuments({
                    author: userId,
                    $or: [
                        { title: { $regex: query.q, $options: 'i' } },
                        { content: { $regex: query.q, $options: 'i' } },
                        { slug: { $regex: query.q, $options: 'i' } },
                    ],
                })
                    .where('tags')
                    .in(query.tags)
                    .where('categories')
                    .in(query.cats);
                const blogs = yield model_1.BlogModel.find({
                    author: userId,
                    $or: [
                        { title: { $regex: query.q, $options: 'i' } },
                        { content: { $regex: query.q, $options: 'i' } },
                        { slug: { $regex: query.q, $options: 'i' } },
                    ],
                })
                    .where('tags')
                    .in(query.tags)
                    .where('categories')
                    .in(query.cats)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (blogs.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Blogs not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'get blogs success',
                    data: {
                        blogs: blogs,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalBlog / limit)
                            ? page + 1
                            : null,
                        totalBlog: totalBlog,
                        totalPages: Math.ceil(totalBlog / limit),
                    },
                };
            }
            else {
                const blogs = yield model_1.BlogModel.find({ author: userId });
                if (blogs.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Blogs not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'get blogs',
                    data: {
                        blogs: blogs,
                        totalBlog: blogs.length,
                    },
                };
            }
        });
    }
    // get blog by slug
    getBlogBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield model_1.BlogModel.findOne({ slug: slug })
                .populate({
                path: 'author',
                select: {
                    name: 1,
                    email: 1,
                    avatar: 1,
                },
            })
                .populate({
                path: 'tags',
                select: {
                    name: 1,
                },
            })
                .populate({
                path: 'categories',
                select: {
                    name: 1,
                },
            });
            return {
                statusCode: 200,
                message: 'get blog',
                data: blog,
            };
        });
    }
    // delete blog by id
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield model_1.BlogModel.findByIdAndDelete(id);
            if (!blog) {
                return {
                    statusCode: 400,
                    message: 'Blog not found',
                };
            }
            yield model_1.BlogModel.findByIdAndDelete(id);
            return {
                statusCode: 200,
                message: 'blog deleted',
            };
        });
    }
    // toggle like by blog id
    toggleBlogLike(blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            // check if blog exists
            const blog = yield model_1.BlogModel.findById(blogId).populate({
                path: 'author',
            });
            if (!blog) {
                return {
                    statusCode: 400,
                    message: 'Blog not found',
                };
            }
            // check if user already liked
            if (blog.likes.includes(userId)) {
                // remove like
                yield model_1.BlogModel.updateOne({ _id: blogId }, { $pull: { likes: userId } });
                if (((_a = blog.author) === null || _a === void 0 ? void 0 : _a._id) != userId) {
                    yield model_1.UserModel.updateOne({
                        _id: (_b = blog.author) === null || _b === void 0 ? void 0 : _b._id,
                    }, {
                        credit: 
                        //@ts-ignore
                        ((_c = blog.author) === null || _c === void 0 ? void 0 : _c.credit) == 0
                            ? 0
                            : //@ts-ignore
                                ((_d = blog.author) === null || _d === void 0 ? void 0 : _d.credit) - 1,
                    }, { new: true });
                }
                return {
                    statusCode: 200,
                    message: 'blog liked Reverted',
                };
            }
            else {
                // add like
                yield model_1.BlogModel.updateOne({ _id: blogId }, { $push: { likes: userId } });
                if (((_e = blog.author) === null || _e === void 0 ? void 0 : _e.id) != userId) {
                    yield model_1.UserModel.updateOne({
                        _id: (_f = blog.author) === null || _f === void 0 ? void 0 : _f._id,
                    }, {
                        //@ts-ignore
                        credit: ((_g = blog.author) === null || _g === void 0 ? void 0 : _g.credit) + 1,
                    }, { new: true });
                }
                return {
                    statusCode: 200,
                    message: 'blog liked',
                };
            }
        });
    }
    // toggle isPublished
    toggleIsPublished(blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // check if blog exists
            const blog = yield model_1.BlogModel.findById(blogId).populate({
                path: 'author',
            });
            if (!blog) {
                return {
                    statusCode: 400,
                    message: 'Blog not found',
                };
            }
            if (((_a = blog.author) === null || _a === void 0 ? void 0 : _a._id) != userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            // check if user already liked
            if (blog.isPublic) {
                // unpublish blog
                yield model_1.BlogModel.updateOne({ _id: blogId }, { $set: { isPublic: false } });
                return {
                    statusCode: 200,
                    message: 'blog published Reverted',
                };
            }
            else {
                // publish blog
                yield model_1.BlogModel.updateOne({ _id: blogId }, { $set: { isPublic: true } });
                return {
                    statusCode: 200,
                    message: 'blog published',
                };
            }
        });
    }
    // add comment
    addComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // check if blog exists
            const blog = yield model_1.BlogModel.findById(data.blogId).populate({
                path: 'author',
            });
            if (!blog) {
                return {
                    statusCode: 400,
                    message: 'Blog not found',
                };
            }
            // create comment
            const newComment = yield new model_1.BlogCommentModel({
                blogId: data.blogId,
                comment: data.comment,
                author: data.userId,
            });
            blog.comments.push(newComment.id);
            yield blog.save();
            // give credit to author
            //@ts-ignore
            if (((_a = blog.author) === null || _a === void 0 ? void 0 : _a.id) != data.userId) {
                yield model_1.UserModel.findOneAndUpdate({
                    _id: (_b = blog.author) === null || _b === void 0 ? void 0 : _b._id,
                }, {
                    //@ts-ignore
                    credit: ((_c = blog.author) === null || _c === void 0 ? void 0 : _c.credit) + 2,
                }, { new: true });
            }
            // save comment
            yield newComment.save();
            return {
                statusCode: 201,
                message: 'comment added',
                data: newComment,
            };
        });
    }
    // update comment
    updateComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // check if comment exists
            const comment = yield model_1.BlogCommentModel.findById(data.id);
            if (!comment) {
                return {
                    statusCode: 400,
                    message: 'Comment not found',
                };
            }
            // check if user is the author
            //@ts-ignore
            if (((_a = comment.author) === null || _a === void 0 ? void 0 : _a._id) != data.userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            // update comment
            const updatedComment = yield model_1.BlogCommentModel.findByIdAndUpdate(data.id, {
                comment: data.comment,
            }, { new: true });
            return {
                statusCode: 200,
                message: 'comment updated',
                data: updatedComment,
            };
        });
    }
    // delete comment
    deleteComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // check if comment exists
            const comment = yield model_1.BlogCommentModel.findById(data.id);
            if (!comment) {
                return {
                    statusCode: 400,
                    message: 'Comment not found',
                };
            }
            // check if user is the author
            //@ts-ignore
            if (((_a = comment.author) === null || _a === void 0 ? void 0 : _a._id) != data.userId) {
                return {
                    statusCode: 400,
                    message: 'Access denied',
                };
            }
            // remove comment from blog
            const blog = yield model_1.BlogModel.findById(comment.blogId).populate({
                path: 'author',
            });
            if ((blog === null || blog === void 0 ? void 0 : blog.comments) && blog.comments.length > 0) {
                blog.comments = blog.comments.filter((item) => item != data.id);
                yield blog.save();
            }
            // delete comment
            yield model_1.BlogCommentModel.findByIdAndDelete(data.id);
            return {
                statusCode: 200,
                message: 'comment deleted',
            };
        });
    }
    // get comments
    getComments(blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalComments = yield model_1.BlogCommentModel.countDocuments({
                    blogId: blogId,
                });
                const comments = yield model_1.BlogCommentModel.find({
                    blogId: blogId,
                })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (comments.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Comments not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'comments found',
                    data: {
                        comments: comments,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalComments / limit)
                            ? page + 1
                            : null,
                        totalComments: totalComments,
                        totalPages: Math.ceil(totalComments / limit),
                    },
                };
            }
            else {
                const comments = yield model_1.BlogCommentModel.find({
                    blogId: blogId,
                }).populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                    },
                });
                if (comments.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Comments not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'comments found',
                    data: comments,
                };
            }
        });
    }
    // get comments by id
    getCommentsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield model_1.BlogCommentModel.findOne({ _id: id });
            if (!comment) {
                return {
                    statusCode: 404,
                    message: 'Comments not found',
                };
            }
            return {
                statusCode: 200,
                message: 'comment found',
                data: comment,
            };
        });
    }
    // get comments by author
    getCommentsByAuthor(userId, blogId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalComments = yield model_1.BlogCommentModel.countDocuments({
                    blogId: blogId,
                    author: userId,
                });
                const comments = yield model_1.BlogCommentModel.find({
                    blogId: blogId,
                    author: userId,
                })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                if (comments.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Comments not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'comments found',
                    data: {
                        comments: comments,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        currentPage: page,
                        nextPage: page + 1 <= Math.ceil(totalComments / limit)
                            ? page + 1
                            : null,
                        totalComments: totalComments,
                        totalPages: Math.ceil(totalComments / limit),
                    },
                };
            }
            else {
                const comments = yield model_1.BlogCommentModel.find({
                    blogId: blogId,
                    author: userId,
                });
                if (comments.length === 0) {
                    return {
                        statusCode: 404,
                        message: 'Comments not found',
                    };
                }
                return {
                    statusCode: 200,
                    message: 'comments found',
                    data: comments,
                };
            }
        });
    }
}
exports.blogService = new BlogService();
//# sourceMappingURL=blog.js.map