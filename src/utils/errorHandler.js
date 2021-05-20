import { isCelebrateError } from "celebrate";

/**
 * * custom error hander for express
 *
 */

const errorHandler = (
  error,
  _req,
  res,
  _next
) => {
  /**
   * * making validations errors consistent with other errors
   */

  if (isCelebrateError(error)) {
    const message =
      (error.details.get("body") && error.details.get("body").message) || "something went wrong";
    return res.status(422).send({
      error: {
        status: 422,
        message,
      },
    });
  }

  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
};

export default errorHandler;
