const { constants } = require("./constant");

exports.errorHandler = (err, req, res, next) => {
  const resp_obj = {
    message: constants.responseMessage.error,
  };
  if (process.env.NODE_ENV === "development") {
    resp_obj.success = "false";
    resp_obj.error = err;
    resp_obj.message = err.message || constants.responseMessage.error;
  }
  res.status(constants.responseCodes.error).json(resp_obj);
};
