"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const errors_1 = require("../errors");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.userRoutes = router;
router
    .route('/avatar')
    .post((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(middlewares_1.multerMiddleware.single('avatar')), (0, errors_1.errorHandler)(controllers_1.userController.uploadAvatar));
router
    .route('/profile')
    .delete((0, errors_1.errorHandler)(middlewares_1.jwtMiddleware), (0, errors_1.errorHandler)(controllers_1.userController.deleteProfile));
router.route('/leaderboard').get((0, errors_1.errorHandler)(controllers_1.userController.getTopTenUsers));
//# sourceMappingURL=user.js.map