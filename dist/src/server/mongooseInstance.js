"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongooseInstance = exports.setMongooseInstance = void 0;
let mongooseInstance;
const setMongooseInstance = (instance) => {
    mongooseInstance = instance;
};
exports.setMongooseInstance = setMongooseInstance;
const getMongooseInstance = () => {
    if (!mongooseInstance)
        throw new Error("Mongoose instance is undefined");
    return mongooseInstance;
};
exports.getMongooseInstance = getMongooseInstance;
//# sourceMappingURL=mongooseInstance.js.map