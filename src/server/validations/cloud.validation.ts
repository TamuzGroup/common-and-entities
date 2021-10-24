import Joi from "joi";

const getFilesList = {
  body: Joi.object().keys({
    folderId: Joi.string().empty(""),
    isRenderChildren: Joi.boolean(),
    cloudType: Joi.string(),
    userId: Joi.string().required(),
  }),
};

const cloudValidation = {
  getFilesList,
};

export default cloudValidation;
