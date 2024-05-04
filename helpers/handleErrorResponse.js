// Here we define helpers funcitons to handle errors response

export function errorResponse(error) {
  let message = 'Internal Server Error';

  // Extract error message from various error types
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error.details) {
    message = error.details[0].message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return {
    success: false,
    error: {
      message: message
    }
  };
}

// When no data
export function notFoundResponse() {
  return {
    success: false,
    message: 'Data not found',
    data: null
  };
}
