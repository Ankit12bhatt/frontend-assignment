import { HttpStatus, responseMessage } from "./constants.js";
import { imageMessage, podcastMessage } from "./message.js";

/**
 * Error handling middleware to handle server errors.
 * @function errorHandler
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the Express.js request-response cycle.
 * @returns {void} This function does not return any value directly. It sends a response to the client.
 */
export const errorHandler = (err, req, res, next) => {
  console.log(err);
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let serverErrorResponse = {
    status: false,
    message: responseMessage.SERVER_ERROR,
  };
  if(err.errorCode === 'invalid_grant' && err.errorNo === 500133){
    serverErrorResponse.message="Authorization failed";
    statusCode = HttpStatus.UNAUTHORIZED
  }
  if (err.code === 'P2025') {
    serverErrorResponse.message='No record found with the specified id';
    statusCode = HttpStatus.NOT_FOUND
  }
  if (err.code === 'P2002') {
    serverErrorResponse.message='Name already exist';
    statusCode = HttpStatus.CONFLICT
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    serverErrorResponse.message=imageMessage.SIZE_LIMIT_EXCEED;
    statusCode = HttpStatus.PAYLOAD_TOO_LARGE
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    serverErrorResponse.message=imageMessage.FILES_LIMIT_PER_REQUEST;
    statusCode = HttpStatus.BAD_REQUEST
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE' && ['startImage','endImage','badgeUrl'].includes(err.field)) {
    serverErrorResponse.message=`Select only 1 image for ${err.field} `;
    statusCode = HttpStatus.BAD_REQUEST
  }
  if(err.message === 'not an image'){
    serverErrorResponse.message=imageMessage.TYPE_ERROR;
    statusCode = HttpStatus.BAD_REQUEST
  }
  if(err.message === 'not an audio/video file'){
    serverErrorResponse.message=podcastMessage.PODCAST_URL_INVALID;
    statusCode = HttpStatus.BAD_REQUEST
  }
  return res.status(statusCode).json(serverErrorResponse);
};

/**
 * Wraps an asynchronous route handler function to catch any asynchronous errors and pass them to the error handling middleware.
 * @function asyncErrorHandler
 * @param {Function} func - The asynchronous route handler function to be wrapped.
 * @returns {Function} A new function that wraps the original route handler function and catches any asynchronous errors.
 */
export const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};
