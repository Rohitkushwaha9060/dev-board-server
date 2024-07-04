"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerModel = exports.QAModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const qaSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
    },
    answers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Answer',
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    tags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tags',
        },
    ],
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const answerSchema = new mongoose_1.default.Schema({
    answer: {
        type: String,
    },
    questionId: {
        type: String,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Users',
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.QAModel = mongoose_1.default.model('QA', qaSchema);
exports.AnswerModel = mongoose_1.default.model('Answer', answerSchema);
//# sourceMappingURL=QA.js.map