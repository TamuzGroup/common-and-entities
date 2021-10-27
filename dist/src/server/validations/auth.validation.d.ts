import Joi from "joi";
export declare const register: {
    body: Joi.ObjectSchema<any>;
};
export declare const sendOTP: {
    body: Joi.ObjectSchema<any>;
};
export declare const verifyOTP: {
    body: Joi.ObjectSchema<any>;
};
export declare const login: {
    body: Joi.ObjectSchema<any>;
};
export declare const logout: {
    body: Joi.ObjectSchema<any>;
};
export declare const refreshTokens: {
    body: Joi.ObjectSchema<any>;
};
export declare const forgotPassword: {
    body: Joi.ObjectSchema<any>;
};
export declare const resetPassword: {
    query: Joi.ObjectSchema<any>;
    body: Joi.ObjectSchema<any>;
};
export declare const verifyEmail: {
    query: Joi.ObjectSchema<any>;
};
//# sourceMappingURL=auth.validation.d.ts.map