import { BlogModel, BlogCommentModel, UserModel } from '@/model';
import { utilsService } from './utils';

class BlogService {
    // create blog
    async createBlog(data: {
        title: string;
        content: string;
        tags: Array<any>;
        categories: Array<any>;
        author: string;
        image: any;
    }) {
        let imageUrl = null;
        let imagePublicId = null;

        const blog = await BlogModel.findOne({
            slug: utilsService.slugifyData(data.title),
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
            const cloudinaryRes: any = await utilsService.uploadToCloudinary(
                data.image.path
            );

            imageUrl = cloudinaryRes.secure_url;
            imagePublicId = cloudinaryRes.public_id;
        }

        // create blog
        const newBlog = await new BlogModel({
            slug: utilsService.slugifyData(data.title),
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
        await newBlog.save();

        return {
            statusCode: 201,
            message: 'blog created',
            data: newBlog,
        };
    }

    // update blog by id
    async updateBlogById(data: {
        id: string;
        title: string;
        content: string;
        tags: Array<any>;
        categories: Array<any>;
        image: any;
        userId: string;
    }) {
        let imageUrl = null;
        let imagePublicId = null;

        // check if blog exist
        const blog = await BlogModel.findById(data.id).populate('author');

        if (!blog) {
            return {
                statusCode: 400,
                message: 'Blog not found',
            };
        }

        //@ts-ignore
        if (blog.author?.id != data.userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        if (blog.image?.url) {
            imageUrl = blog.image?.url || null;
            imagePublicId = blog.image?.public_id || null;
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
            const cloudinaryRes: any = await utilsService.uploadToCloudinary(
                data.image.path
            );

            if (blog.image?.url) {
                await utilsService.deleteFromCloudinary(blog.image?.public_id!);
            }

            imageUrl = cloudinaryRes.secure_url;
            imagePublicId = cloudinaryRes.public_id;
        }

        // update blog
        const newBlog = await BlogModel.findByIdAndUpdate(
            data.id,
            {
                slug: utilsService.slugifyData(data.title),
                tags: data.tags,
                categories: data.categories,
                title: data.title,
                content: data.content,
                image: {
                    url: imageUrl,
                    public_id: imagePublicId,
                },
            },
            { new: true }
        );

        return {
            statusCode: 200,
            message: 'blog updated',
            data: newBlog,
        };
    }

    // get blogs
    async getBlogs(query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';
            if (!query.q) {
                query.q = '';
            }

            const tags = await BlogModel.distinct('tags');
            const cats = await BlogModel.distinct('categories');
            query.tags = query.tags != '' ? query.tags.split(',') : [...tags];
            query.cats = query.cats != '' ? query.cats.split(',') : [...cats];

            const totalBlog = await BlogModel.countDocuments({
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

            const blogs = await BlogModel.find({
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
                    nextPage:
                        page + 1 <= Math.ceil(totalBlog / limit)
                            ? page + 1
                            : null,
                    totalBlog: totalBlog,
                    totalPages: Math.ceil(totalBlog / limit),
                },
            };
        } else {
            const blogs = await BlogModel.find({ isPublic: true })
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
    }

    // get all blogs by author
    async getAllBlogsByAuthor(userId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            if (!query.q) {
                query.q = '';
            }

            const tags = await BlogModel.distinct('tags');
            const cats = await BlogModel.distinct('categories');
            query.tags =
                query.tags != '' || query.tags != undefined ? [...tags] : [];
            query.cats =
                query.cats != '' || query.cats != undefined ? [...cats] : [];

            const totalBlog = await BlogModel.countDocuments({
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

            const blogs = await BlogModel.find({
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
                    nextPage:
                        page + 1 <= Math.ceil(totalBlog / limit)
                            ? page + 1
                            : null,
                    totalBlog: totalBlog,
                    totalPages: Math.ceil(totalBlog / limit),
                },
            };
        } else {
            const blogs = await BlogModel.find({ author: userId });

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
    }

    // get blog by slug
    async getBlogBySlug(slug: string) {
        const blog = await BlogModel.findOne({ slug: slug })
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
    }

    // delete blog by id
    async deleteBlogById(id: string) {
        const blog = await BlogModel.findByIdAndDelete(id);

        if (!blog) {
            return {
                statusCode: 400,
                message: 'Blog not found',
            };
        }

        await BlogModel.findByIdAndDelete(id);
        return {
            statusCode: 200,
            message: 'blog deleted',
        };
    }

    // toggle like by blog id
    async toggleBlogLike(blogId: string, userId: any) {
        // check if blog exists
        const blog = await BlogModel.findById(blogId).populate({
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
            await BlogModel.updateOne(
                { _id: blogId },
                { $pull: { likes: userId } }
            );
            if (blog.author?._id != userId) {
                await UserModel.updateOne(
                    {
                        _id: blog.author?._id,
                    },
                    {
                        credit:
                            //@ts-ignore
                            blog.author?.credit == 0
                                ? 0
                                : //@ts-ignore
                                  blog.author?.credit - 1,
                    },
                    { new: true }
                );
            }
            return {
                statusCode: 200,
                message: 'blog liked Reverted',
            };
        } else {
            // add like
            await BlogModel.updateOne(
                { _id: blogId },
                { $push: { likes: userId } }
            );
            if (blog.author?.id != userId) {
                await UserModel.updateOne(
                    {
                        _id: blog.author?._id,
                    },
                    {
                        //@ts-ignore
                        credit: blog.author?.credit + 1,
                    },
                    { new: true }
                );
            }
            return {
                statusCode: 200,
                message: 'blog liked',
            };
        }
    }

    // toggle isPublished
    async toggleIsPublished(blogId: string, userId: any) {
        // check if blog exists
        const blog = await BlogModel.findById(blogId).populate({
            path: 'author',
        });

        if (!blog) {
            return {
                statusCode: 400,
                message: 'Blog not found',
            };
        }

        if (blog.author?._id != userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        // check if user already liked
        if (blog.isPublic) {
            // unpublish blog
            await BlogModel.updateOne(
                { _id: blogId },
                { $set: { isPublic: false } }
            );
            return {
                statusCode: 200,
                message: 'blog published Reverted',
            };
        } else {
            // publish blog
            await BlogModel.updateOne(
                { _id: blogId },
                { $set: { isPublic: true } }
            );
            return {
                statusCode: 200,
                message: 'blog published',
            };
        }
    }

    // top blogs
    async topBlogs(query: any) {
        const topBlogs = await BlogModel.aggregate([
            {
                $addFields: {
                    totalInteractions: {
                        $add: [{ $size: '$likes' }, { $size: '$comments' }],
                    },
                },
            },
            {
                $sort: { totalInteractions: -1 },
            },
            {
                $limit: 10,
            },

            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categories',
                    foreignField: '_id',
                    as: 'categories',
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    likes: 1,
                    comments: 1,
                    author: {
                        _id: 1,
                        name: 1,
                        email: 1,
                    },
                    tags: {
                        name: 1,
                    },
                    categories: {
                        name: 1,
                    },
                    totalInteractions: 1,
                },
            },
        ]);

        if (topBlogs.length === 0) {
            return {
                statusCode: 404,
                message: 'Top Blogs not found',
            };
        }

        return {
            statusCode: 200,
            message: 'Top Blogs found',
            data: topBlogs,
        };
    }

    // add comment
    async addComment(data: {
        blogId: string;
        comment: string;
        userId: string;
    }) {
        // check if blog exists
        const blog = await BlogModel.findById(data.blogId).populate({
            path: 'author',
        });

        if (!blog) {
            return {
                statusCode: 400,
                message: 'Blog not found',
            };
        }

        // create comment
        const newComment = await new BlogCommentModel({
            blogId: data.blogId,
            comment: data.comment,
            author: data.userId,
        });

        blog.comments.push(newComment.id);
        await blog.save();

        // give credit to author
        //@ts-ignore
        if (blog.author?.id != data.userId) {
            await UserModel.findOneAndUpdate(
                {
                    _id: blog.author?._id,
                },
                {
                    //@ts-ignore
                    credit: blog.author?.credit + 2,
                },
                { new: true }
            );
        }

        // save comment
        await newComment.save();

        return {
            statusCode: 201,
            message: 'comment added',
            data: newComment,
        };
    }

    // update comment
    async updateComment(data: { id: string; comment: string; userId: string }) {
        // check if comment exists
        const comment = await BlogCommentModel.findById(data.id);

        if (!comment) {
            return {
                statusCode: 400,
                message: 'Comment not found',
            };
        }

        // check if user is the author
        //@ts-ignore
        if (comment.author?._id != data.userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        // update comment
        const updatedComment = await BlogCommentModel.findByIdAndUpdate(
            data.id,
            {
                comment: data.comment,
            },
            { new: true }
        );

        return {
            statusCode: 200,
            message: 'comment updated',
            data: updatedComment,
        };
    }

    // delete comment
    async deleteComment(data: { id: string; userId: string }) {
        // check if comment exists
        const comment = await BlogCommentModel.findById(data.id);

        if (!comment) {
            return {
                statusCode: 400,
                message: 'Comment not found',
            };
        }

        // check if user is the author
        //@ts-ignore
        if (comment.author?._id != data.userId) {
            return {
                statusCode: 400,
                message: 'Access denied',
            };
        }

        // remove comment from blog
        const blog = await BlogModel.findById(comment.blogId).populate({
            path: 'author',
        });

        if (blog?.comments && blog.comments.length > 0) {
            blog.comments = blog.comments.filter(
                (item) => item != (data.id as any)
            );
            await blog.save();
        }

        // delete comment
        await BlogCommentModel.findByIdAndDelete(data.id);

        return {
            statusCode: 200,
            message: 'comment deleted',
        };
    }

    // get comments
    async getComments(blogId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalComments = await BlogCommentModel.countDocuments({
                blogId: blogId,
            });

            const comments = await BlogCommentModel.find({
                blogId: blogId,
            })
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'author',
                    select: {
                        name: 1,
                        email: 1,
                        avatar: 1,
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
                data: {
                    comments: comments,
                    prevPage: page - 1 > 0 ? page - 1 : null,
                    currentPage: page,
                    nextPage:
                        page + 1 <= Math.ceil(totalComments / limit)
                            ? page + 1
                            : null,
                    totalComments: totalComments,
                    totalPages: Math.ceil(totalComments / limit),
                },
            };
        } else {
            const comments = await BlogCommentModel.find({
                blogId: blogId,
            }).populate({
                path: 'author',
                select: {
                    name: 1,
                    email: 1,
                    avatar: 1,
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
    }

    // get comments by id
    async getCommentsById(id: string) {
        const comment = await BlogCommentModel.findOne({ _id: id }).populate({
            path: 'author',
            select: {
                name: 1,
                email: 1,
                avatar: 1,
            },
        });

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
    }

    // get comments by author
    async getCommentsByAuthor(userId: string, blogId: string, query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalComments = await BlogCommentModel.countDocuments({
                blogId: blogId,
                author: userId,
            });

            const comments = await BlogCommentModel.find({
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
                    nextPage:
                        page + 1 <= Math.ceil(totalComments / limit)
                            ? page + 1
                            : null,
                    totalComments: totalComments,
                    totalPages: Math.ceil(totalComments / limit),
                },
            };
        } else {
            const comments = await BlogCommentModel.find({
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
    }
}

export const blogService = new BlogService();
