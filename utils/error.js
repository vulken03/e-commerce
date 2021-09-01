const { constants } = require("./constant");

exports.errorHandler = (err, req, res, next) => {
  const resp_obj = {
    message: constants.responseMessage.error,
  };
  if (process.env.NODE_ENV === "development") {
    resp_obj.message = err.message || constants.responseMessage.error;
    resp_obj.error = err;
  }
  res.status(constants.responseCodes.error).json(resp_obj);
};


