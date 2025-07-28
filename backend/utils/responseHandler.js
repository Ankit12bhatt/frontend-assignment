export const successResponse = (data, message = "Success") => ({
  status: true,
  message,
  data,
});

export const errorResponse = (message = "Error") => ({
  status: false,
  message,
});
