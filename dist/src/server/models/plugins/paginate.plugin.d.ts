import { Document, FilterQuery, Model, Schema, EnforceDocument } from 'mongoose';
/**
 * Mongoose DB paginate options parameter type
 */
export declare type PaginateOptions = {
    sortBy?: string;
    populate?: string;
    limit?: string;
    page?: string;
};
export declare type PaginationFunc<DocType = Document, TMethods = Record<string, never>> = (filter: FilterQuery<DocType>, options: PaginateOptions) => Promise<QueryResult<DocType, TMethods>>;
/**
 * Mongoose DB paginate query result return type
 */
export declare type QueryResult<DocType = Document, TMethods = Record<string, never>> = {
    results: EnforceDocument<DocType, TMethods>[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
};
declare const paginate: <DocType = Document<any, any, any>, TQueryHelpers = Record<string, never>, TMethods = Record<string, never>, SchemaDefinitionType = undefined>(schema: Schema<DocType, Model<DocType, TQueryHelpers, TMethods>, SchemaDefinitionType, {}>) => void;
export default paginate;
//# sourceMappingURL=paginate.plugin.d.ts.map