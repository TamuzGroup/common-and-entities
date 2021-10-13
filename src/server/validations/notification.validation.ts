import Joi from "joi";

const sendSms = {
  body: Joi.object().keys({
    to: Joi.string().required(),
    body: Joi.string().required(),
    executeAt: Joi.date().required(),
    adminKey: Joi.string().required(),
  }),
};

const notificationValidation = {
  sendSms,
};

export default notificationValidation;
