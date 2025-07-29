import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";


export function parseTryCatchError(e: unknown, defaultMessage?: string) {
  if (e instanceof Error) {
    return e.message;
  } else return defaultMessage || 'Something went wrong';
}
export function parseApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined
): string {
  // Handle the case where error is undefined
  if (error === undefined) {
    return "An unknown error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  // Check if the error is of type FetchBaseQueryError
  if ("status" in error) {
    const fetchError = error as FetchBaseQueryError;
    const status = fetchError.status;

    // Attempt to get the error message from the data object
    // Using @ts-ignore to ignore TypeScript error if data type is not guaranteed to have message
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const errorMessage = fetchError.data?.message || "Unknown error";

    // Return specific error messages based on the HTTP status code
    switch (status) {
      case 400:
        return `Bad Request: ${errorMessage}`;
      case 401:
        return `Unauthorized: ${errorMessage}`;
      case 403:
        return `Forbidden: ${errorMessage}`;
      case 404:
        return `Not Found: ${errorMessage}`;
      case 500:
        return `Internal Server Error: ${errorMessage}`;
      case 409:
        return `Conflict: ${errorMessage}`;
      default:
        return `Error: ${errorMessage}`;
    }
  }

  // Check if the error is of type SerializedError
  if ("message" in error) {
    const serializedError = error as SerializedError;
    return serializedError.message || "An unknown serialized error occurred.";
  }

  // Default case if error type is not recognized
  return "An unknown error occurred.";
}
