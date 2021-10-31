import Joi from "joi";

const getToken = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const safeBoxValidation = {
  getToken,
};

export default safeBoxValidation;
