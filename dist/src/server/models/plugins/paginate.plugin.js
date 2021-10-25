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
const paginate = (schema) => {
    /**
     * @typedef {QueryResult<DocType, TMethods>} QueryResult
     * @property {EnforceDocument<DocType, TMethods>[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {FilterQuery<DocType>} [filter] - Mongo filter
     * @param {PaginateOptions} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult<DocType, TMethods>>}
     */
    schema.static({
        paginate(filter, options = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                let sort = '';
                if (options.sortBy) {
                    const sortingCriteria = [];
                    options.sortBy.split(',').forEach((sortOption) => {
                        const [key, order] = sortOption.split(':');
                        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
                    });
                    sort = sortingCriteria.join(' ');
                }
                else {
                    sort = 'createdAt';
                }
                const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
                const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
                const skip = (page - 1) * limit;
                const countPromise = this.countDocuments(filter).exec();
                let query = this.find(filter).sort(sort).skip(skip).limit(limit);
                if (options.populate) {
                    options.populate.split(',').forEach((populateOption) => {
                        query = query.populate(populateOption
                            .split('.')
                            .reverse()
                            .reduce((accumulator, path) => {
                            const prevOptions = accumulator.length ? accumulator[accumulator.length - 1] : undefined;
                            accumulator.push((prevOptions === null || prevOptions === void 0 ? void 0 : prevOptions.path) ? { path, populate: { path: prevOptions === null || prevOptions === void 0 ? void 0 : prevOptions.path } } : { path });
                            return accumulator;
                        }, []));
                    });
                }
                // EnforceDocument<DocType & Record<string, EnforceDocument<Document, Record<string, unknown>>[]>, TMethods>
                const docsPromise = query.exec();
                return Promise.all([countPromise, docsPromise]).then((values) => {
                    const [totalResults, results] = values;
                    const totalPages = Math.ceil(totalResults / limit);
                    const result = {
                        results,
                        page,
                        limit,
                        totalPages,
                        totalResults,
                    };
                    return Promise.resolve(result);
                });
            });
        },
    });
};
exports.default = paginate;
//# sourceMappingURL=paginate.plugin.js.map