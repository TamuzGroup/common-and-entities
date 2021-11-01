import Joi from "joi";
export declare const createUser: {
    body: Joi.ObjectSchema<any>;
};
export declare const getUsers: {
    query: Joi.ObjectSchema<any>;
};
export declare const getUser: {
    params: Joi.ObjectSchema<any>;
};
export declare const updateUser: {
    params: Joi.ObjectSchema<any>;
    body: Joi.ObjectSchema<any>;
};
export declare const deleteUser: {
    params: Joi.ObjectSchema<any>;
};
//# sourceMappingURL=user.validation.d.ts.map