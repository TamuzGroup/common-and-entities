import { FilterQuery, Types } from "mongoose";
import { PaginateOptions, QueryResult } from "../models/plugins/paginate.plugin";
import { IUser, IUserDoc, IUserLeanDoc, IUserMethods, IUserQueryWithHelper } from "../models/user.model";
/**
 * Create a user
 * @param {IUserLeanDoc} userBody
 * @returns {Promise<IUserDoc>}
 */
export declare const createUser: (userBody: IUserLeanDoc) => Promise<IUserDoc>;
/**
 * Query for users
 * @param {FilterQuery<IUser>} filter - Mongo filter
 * @param {PaginateOptions} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult<IUser, IUserMethods>>}
 */
export declare const queryUsers: (filter: FilterQuery<IUser>, options: PaginateOptions) => Promise<QueryResult<IUser, IUserMethods>>;
/**
 * Get user by id
 * @param {Types.ObjectId} id
 * @returns {Promise<IUserQueryWithHelper>}
 */
export declare const getUserById: (id: string | Types.ObjectId) => Promise<IUserQueryWithHelper>;
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserQueryWithHelper>}
 */
export declare const getUserByEmail: (email: string) => Promise<IUserQueryWithHelper>;
/**
 * Get user by id number
 * @param {string} idNumber
 * @returns {Promise<IUserQueryWithHelper>}
 */
export declare const getUserByIdNumber: (idNumber: string) => Promise<IUserQueryWithHelper>;
/**
 * Update user by id
 * @param {string | Types.ObjectId} id
 * @param {Partial<IUser>} updateBody
 * @returns {Promise<IUserDoc>}
 */
export declare const updateUserById: (id: string | Types.ObjectId, updateBody: Partial<IUser>) => Promise<IUserDoc>;
/**
 * Delete user by id
 * @param {string | Types.ObjectId} userId
 * @returns {Promise<IUserDoc>}
 */
export declare const deleteUserById: (userId: string | Types.ObjectId) => Promise<IUserDoc>;
//# sourceMappingURL=user.service.d.ts.map