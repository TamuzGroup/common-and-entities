import Joi from "joi";

const getFilesList = {
  body: Joi.object().keys({
    folderId: Joi.string().required(),
    isRenderChildren: Joi.boolean(),
    cloudType: Joi.string().required(),
  }),
};

const cloudValidation = {
  getFilesList,
};

export default cloudValidation;
