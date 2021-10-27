"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUserByIdNumber = exports.getUserByEmail = exports.getUserById = exports.queryUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Create a user
 * @param {IUserLeanDoc} userBody
 * @returns {Promise<IUserDoc>}
 */
const createUser = async (userBody) => {
    if (await user_model_1.default.isEmailTaken(userBody.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already taken");
    }
    return user_model_1.default.create(userBody);
};
exports.createUser = createUser;
/**
 * Query for users
 * @param {FilterQuery<IUser>} filter - Mongo filter
 * @param {PaginateOptions} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult<IUser, IUserMethods>>}
 */
const queryUsers = async (filter, options) => {
    const users = typeof user_model_1.default.paginate === "function"
        ? await user_model_1.default.paginate(filter, options)
        : { results: [], page: 0, limit: 0, totalPages: 0, totalResults: 0 };
    return users;
};
exports.queryUsers = queryUsers;
/**
 * Get user by id
 * @param {Types.ObjectId} id
 * @returns {Promise<IUserQueryWithHelper>}
 */
const getUserById = async (id) => {
    return user_model_1.default.findById(id);
};
exports.getUserById = getUserById;
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserQueryWithHelper>}
 */
const getUserByEmail = async (email) => {
    return user_model_1.default.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
/**
 * Get user by id number
 * @param {string} idNumber
 * @returns {Promise<IUserQueryWithHelper>}
 */
const getUserByIdNumber = async (idNumber) => {
    return user_model_1.default.findOne({ idNumber });
};
exports.getUserByIdNumber = getUserByIdNumber;
/**
 * Update user by id
 * @param {string | Types.ObjectId} id
 * @param {Partial<IUser>} updateBody
 * @returns {Promise<IUserDoc>}
 */
const updateUserById = async (id, updateBody) => {
    const user = await exports.getUserById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (updateBody.email &&
        (await user_model_1.default.isEmailTaken(updateBody.email, id))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already taken");
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};
exports.updateUserById = updateUserById;
/**
 * Delete user by id
 * @param {string | Types.ObjectId} userId
 * @returns {Promise<IUserDoc>}
 */
const deleteUserById = async (userId) => {
    const user = await exports.getUserById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    await user.remove();
    return user;
};
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=user.service.js.map