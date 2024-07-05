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
exports.tagAndCategoryService = void 0;
const model_1 = require("../model");
class TagAndCategoryService {
    // create tag
    createTag(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield model_1.TagModel.findOne({ name });
            if (tag) {
                return {
                    statusCode: 400,
                    message: 'Tag already exists',
                };
            }
            const newTag = yield model_1.TagModel.create({ name });
            return {
                statusCode: 201,
                message: 'Tag created',
                data: {
                    newTag,
                },
            };
        });
    }
    // update tag
    updateTag(tagId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield model_1.TagModel.findById(tagId);
            if (!tag) {
                return {
                    statusCode: 404,
                    message: 'Tag not found',
                };
            }
            const updatedTag = yield model_1.TagModel.findOneAndUpdate({ _id: tagId }, { name }, { new: true });
            return {
                statusCode: 200,
                message: 'Tag updated',
                data: {
                    updatedTag,
                },
            };
        });
    }
    // delete tag
    deleteTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield model_1.TagModel.findById(tagId);
            if (!tag) {
                return {
                    statusCode: 404,
                    message: 'Tag not found',
                };
            }
            yield model_1.TagModel.deleteOne({ _id: tagId });
            return {
                statusCode: 200,
                message: 'Tag deleted',
            };
        });
    }
    // get all tags
    getAllTags(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalTags = yield model_1.TagModel.countDocuments();
                const tags = yield model_1.TagModel.find()
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
                        nextPage: page + 1 <= Math.ceil(totalTags / limit)
                            ? page + 1
                            : null,
                        totalTags: totalTags,
                        totalPages: Math.ceil(totalTags / limit),
                    },
                };
            }
            else {
                const tags = yield model_1.TagModel.find();
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
        });
    }
    // get tag by id
    getTagById(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield model_1.TagModel.findById(tagId);
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
        });
    }
    // create category
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield model_1.CategoryModel.findOne({ name });
            if (category) {
                return {
                    statusCode: 400,
                    message: 'Category already exists',
                };
            }
            const newCategory = yield model_1.CategoryModel.create({ name });
            return {
                statusCode: 201,
                message: 'Category created',
                data: {
                    newCategory,
                },
            };
        });
    }
    // update category
    updateCategory(categoryId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield model_1.CategoryModel.findById(categoryId);
            if (!category) {
                return {
                    statusCode: 404,
                    message: 'Category not found',
                };
            }
            const updatedCategory = yield model_1.CategoryModel.findOneAndUpdate({ _id: categoryId }, { name }, { new: true });
            return {
                statusCode: 200,
                message: 'Category updated',
                data: {
                    updatedCategory,
                },
            };
        });
    }
    // delete category
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield model_1.CategoryModel.findById(categoryId);
            if (!category) {
                return {
                    statusCode: 404,
                    message: 'Category not found',
                };
            }
            yield model_1.CategoryModel.deleteOne({ _id: categoryId });
            return {
                statusCode: 200,
                message: 'Category deleted',
            };
        });
    }
    // get all categories
    getAllCategories(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.func == 'true') {
                const page = query.page ? parseInt(query.page) : 1;
                const limit = query.limit ? parseInt(query.limit) : 10;
                const skip = (page - 1) * limit;
                const sort = query.sort ? query.sort : '-createdAt';
                const totalCategories = yield model_1.CategoryModel.countDocuments();
                const categories = yield model_1.CategoryModel.find()
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
                        nextPage: page + 1 <= Math.ceil(totalCategories / limit)
                            ? page + 1
                            : null,
                        totalCategories: totalCategories,
                        totalPages: Math.ceil(totalCategories / limit),
                    },
                };
            }
            else {
                const categories = yield model_1.CategoryModel.find();
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
        });
    }
    // get category by id
    getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield model_1.CategoryModel.findById(categoryId);
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
        });
    }
}
exports.tagAndCategoryService = new TagAndCategoryService();
//# sourceMappingURL=tagAndCategory.js.map