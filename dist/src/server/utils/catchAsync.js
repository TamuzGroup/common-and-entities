"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const catchAsync = (
/* eslint-enable @typescript-eslint/no-explicit-any */
fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
};
exports.default = catchAsync;
//# sourceMappingURL=catchAsync.js.map