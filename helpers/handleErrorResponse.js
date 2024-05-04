// Here we define helpers funcitons to handle errors response

export function clientErrorResponse(error) {
  let errorObj = {};

  // Extract error message from various error types
  if (error instanceof Error) {
    errorObj = {
      message: error.message,
      code: error.code
    }
  } else if (typeof error === 'object' && error.details) {
    errorObj = {
      message: error.details[0].message,
      type: error.details[0].type,
      context: error.details[0].context
    }
  } else if (typeof error === 'string') {
    errorObj = {
      message: error
    }
  }

  return {
    success: false,
    error: errorObj
  };
}

export function serverErrorResponse(error) {
  return {
    success: false,
    error: {
      message: error.sqlMessage,
      code: error.code
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
