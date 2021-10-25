"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteAtPath = (obj, path, index) => {
    if (obj === undefined || index < 0 || index >= path.length) {
        return;
    }
    const selectedPath = path[index];
    if (index === path.length - 1) {
        delete obj[selectedPath];
    }
    else {
        const subObj = obj[selectedPath];
        if (typeof subObj === "object" && subObj !== null) {
            deleteAtPath(subObj, path, index + 1);
        }
    }
};
const toJSON = (schema) => {
    var _a, _b, _c;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anySchema = schema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
    const transform = typeof ((_b = (_a = anySchema.options) === null || _a === void 0 ? void 0 : _a.toJSON) === null || _b === void 0 ? void 0 : _b.transform) === "function"
        ? anySchema.options.toJSON.transform
        : undefined;
    anySchema.options.toJSON = Object.assign(((_c = anySchema.options) === null || _c === void 0 ? void 0 : _c.toJSON) || {}, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transform(model, ret) {
            Object.keys(schema.paths).forEach((path) => {
                var _a, _b;
                if ((_b = (_a = anySchema.paths[path]) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.private) {
                    deleteAtPath(ret, path.split("."), 0);
                }
            });
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete ret.createdAt;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete ret.updatedAt;
            if (transform) {
                return transform(model, ret);
            }
        },
    });
};
exports.default = toJSON;
//# sourceMappingURL=toJSON.plugin.js.map