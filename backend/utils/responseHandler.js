export const successResponse = (data, message = "Success") => ({
  status: true,
  message,
  data,
});

export const errorResponse = (message = "Error", data = null) => ({
  status: false,
  message,
  data,
});
