import { Joi, Segments } from "celebrate";

/**
 * *  schemas for validating requests comming from client side
 */

const authSchema = {
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
    // .min(8)
    // .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    // .message(
    //   '"{#label}" must contain one uppercase letter, one lowercase letter, and one digit'
    // )
    .required(),
};

export const signupFormValidator = {
  [Segments.BODY]: Joi.object().keys({
    displayName: Joi.string().trim().required(),
    // token: Joi.string().required(),
    ...authSchema,
  }),
};

export const loginFormValidator = {
  [Segments.BODY]: Joi.object().keys({
    // token: Joi.string().required(),
    ...authSchema,
  }),
};

export const addPlacesValidator = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(5000).required(),
    image: Joi.string().required(),
    type: Joi.string().required(),
    location: Joi.array().items(Joi.number().required()).length(2).required(),
  }),
};

export const editPlaceValidator = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().max(50),
    description: Joi.string().max(5000),
    type: Joi.string(),
    image: Joi.string(),
    location: Joi.array().items(Joi.number().required()).length(2),
  }),
};

export const createReviewValidator = {
  [Segments.BODY]: Joi.object().keys({
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().max(2000).required(),
    img: Joi.string(),
    title: Joi.string().max(50),
  }),
};

export const editReviewValidator = {
  [Segments.BODY]: Joi.object().keys({
    rating: Joi.number().min(0).max(5),
    comment: Joi.string().max(2000),
    img: Joi.string(),
    title: Joi.string().max(50),
  }),
};

export const beGuideValidator = {
  [Segments.BODY]: Joi.object().keys({
    description: Joi.string().max(3000).required(),
    instagram: Joi.string()
      .allow("")
      .uri()
      .regex(/http(?:s)?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_]+)/)
      .message('"{#label}" profile url is invalid'),
    twitter: Joi.string()
      .allow("")
      .uri()
      .regex(/http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/)
      .message('"{#label}" profile url is invalid'),
    facebook: Joi.string()
      .uri()
      .allow("")
      .regex(/http(?:s)?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/)
      .message('"{#label}" profile url is invalid'),
    linkedin: Joi.string()
      .uri()
      .allow("")
      .regex(
        /((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^\/]+\/(([\w|\d-&#?=])+\/?){1,}))$/
      )
      .message('"{#label}" profile url is invalid'),
  }),
};

export const adminEditPlacesValidator = {
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().max(20).required(),
      description: Joi.string().max(2000).required(),
      image: Joi.string().required(),
      type: Joi.string().required(),
      rating: Joi.number().max(5).min(0).required(),
      location: Joi.array().items(Joi.number().required()).length(2).required(),
    })
    .unknown(),
};
