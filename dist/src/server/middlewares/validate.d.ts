import Joi from "joi";
import { RequestHandler } from "express";
export declare type ValidateSchema = {
    body?: boolean | Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
};
declare const validate: (schema: ValidateSchema) => RequestHandler;
export default validate;
//# sourceMappingURL=validate.d.ts.map