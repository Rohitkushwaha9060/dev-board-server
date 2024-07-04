"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errors_1 = require("../errors");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.tagRoutes = router;
router
    .route('/')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.checkPermissionMiddleware), (0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.createTag))
    .get((0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.getAllTags));
router
    .route('/:tagId')
    .patch((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.checkPermissionMiddleware), (0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.updateTag))
    .delete((0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.deleteTag))
    .get((0, errors_1.errorHandler)(controllers_1.tagAndCategoryController.getTagById));
//# sourceMappingURL=tag.js.map