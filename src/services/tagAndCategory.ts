import { TagModel, CategoryModel } from '@/model';

class TagAndCategoryService {
    // create tag
    async createTag(name: string) {
        const tag = await TagModel.findOne({ name });

        if (tag) {
            return {
                statusCode: 400,
                message: 'Tag already exists',
            };
        }

        const newTag = await TagModel.create({ name });
        return {
            statusCode: 201,
            message: 'Tag created',
            data: {
                newTag,
            },
        };
    }

    // update tag
    async updateTag(tagId: string, name: string) {
        const tag = await TagModel.findById(tagId);
        if (!tag) {
            return {
                statusCode: 404,
                message: 'Tag not found',
            };
        }
        const updatedTag = await TagModel.findOneAndUpdate(
            { _id: tagId },
            { name },
            { new: true }
        );
        return {
            statusCode: 200,
            message: 'Tag updated',
            data: {
                updatedTag,
            },
        };
    }

    // delete tag
    async deleteTag(tagId: string) {
        const tag = await TagModel.findById(tagId);
        if (!tag) {
            return {
                statusCode: 404,
                message: 'Tag not found',
            };
        }
        await TagModel.deleteOne({ _id: tagId });
        return {
            statusCode: 200,
            message: 'Tag deleted',
        };
    }

    // get all tags
    async getAllTags(query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalTags = await TagModel.countDocuments();

            const tags = await TagModel.find()
                .sort(sort)
                .skip(skip)
                .limit(limit);

            if (tags.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Tags not found',
                };
            }

            return {
                statusCode: 200,
                message: 'Tags found',
                data: {
                    tags: tags,
                    prevPage: page - 1 > 0 ? page - 1 : null,
                    currentPage: page,
                    nextPage:
                        page + 1 <= Math.ceil(totalTags / limit)
                            ? page + 1
                            : null,
                    totalTags: totalTags,
                    totalPages: Math.ceil(totalTags / limit),
                },
            };
        } else {
            const tags = await TagModel.find();
            if (tags.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Tags not found',
                };
            }
            return {
                statusCode: 200,
                message: 'Tags found',
                data: {
                    tags: tags,
                    totalTags: tags.length,
                },
            };
        }
    }

    // get tag by id
    async getTagById(tagId: string) {
        const tag = await TagModel.findById(tagId);
        if (!tag) {
            return {
                statusCode: 404,
                message: 'Tag not found',
            };
        }
        return {
            statusCode: 200,
            message: 'Tag found',
            data: {
                tag,
            },
        };
    }

    // create category
    async createCategory(name: string) {
        const category = await CategoryModel.findOne({ name });

        if (category) {
            return {
                statusCode: 400,
                message: 'Category already exists',
            };
        }

        const newCategory = await CategoryModel.create({ name });
        return {
            statusCode: 201,
            message: 'Category created',
            data: {
                newCategory,
            },
        };
    }

    // update category
    async updateCategory(categoryId: string, name: string) {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return {
                statusCode: 404,
                message: 'Category not found',
            };
        }
        const updatedCategory = await CategoryModel.findOneAndUpdate(
            { _id: categoryId },
            { name },
            { new: true }
        );
        return {
            statusCode: 200,
            message: 'Category updated',
            data: {
                updatedCategory,
            },
        };
    }

    // delete category
    async deleteCategory(categoryId: string) {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return {
                statusCode: 404,
                message: 'Category not found',
            };
        }
        await CategoryModel.deleteOne({ _id: categoryId });
        return {
            statusCode: 200,
            message: 'Category deleted',
        };
    }

    // get all categories
    async getAllCategories(query: any) {
        if (query.func == 'true') {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;
            const sort = query.sort ? query.sort : '-createdAt';

            const totalCategories = await CategoryModel.countDocuments();

            const categories = await CategoryModel.find()
                .sort(sort)
                .skip(skip)
                .limit(limit);

            if (categories.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Categories not found',
                };
            }

            return {
                statusCode: 200,
                message: 'Categories found',
                data: {
                    categories: categories,
                    prevPage: page - 1 > 0 ? page - 1 : null,
                    currentPage: page,
                    nextPage:
                        page + 1 <= Math.ceil(totalCategories / limit)
                            ? page + 1
                            : null,
                    totalCategories: totalCategories,
                    totalPages: Math.ceil(totalCategories / limit),
                },
            };
        } else {
            const categories = await CategoryModel.find();

            if (categories.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Categories not found',
                };
            }

            return {
                statusCode: 200,
                message: 'Categories found',
                data: {
                    categories: categories,
                    totalCategories: categories.length,
                },
            };
        }
    }

    // get category by id
    async getCategoryById(categoryId: string) {
        const category = await CategoryModel.findById(categoryId);

        if (!category) {
            return {
                statusCode: 404,
                message: 'Category not found',
            };
        }

        return {
            statusCode: 200,
            message: 'category found',
            data: {
                category,
            },
        };
    }
}
export const tagAndCategoryService = new TagAndCategoryService();
