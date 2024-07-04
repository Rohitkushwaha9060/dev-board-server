"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errors_1 = require("../errors");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.categoryRoutes = router;
router
    .route('/')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.checkPermissionMiddleware), (0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.createCategory))
    .get((0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.getAllCategories));
router
    .route('/:categoryId')
    .patch((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.checkPermissionMiddleware), (0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.updateCategory))
    .delete((0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.deleteCategory))
    .get((0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.getCategoryById));
//# sourceMappingURL=category.js.map