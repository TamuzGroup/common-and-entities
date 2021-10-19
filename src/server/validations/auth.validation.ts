import Joi from "joi";
import { password } from "./custom.validation";

export const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: {
      first: Joi.string().required(),
      last: Joi.string().required(),
    },
    dateOfBirth: Joi.date().required(),
    idNumber: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }),
};

export const sendOTP = {
  body: Joi.object().keys({
    // @TODO - add custom rules validators
    idNumber: Joi.string().required(),
    birthYear: Joi.string().required(),
  }),
};

export const verifyOTP = {
  body: Joi.object().keys({
    // @TODO - add custom rules validators
    passcode: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
