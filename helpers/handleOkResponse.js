// Here we define helpers functions to handle successful response

export function okResponse(data) {
  // Extract data message from various data types
  if (typeof data === 'string') {
    return {
      success: true,
      message: data
    };
  } else if (data instanceof Array) {
    return {
      success: true,
      message: 'Data fetched/created/updated successfully',
      data
    };
  } else if (typeof data === 'object') {
    return {
      success: true,
      message: 'Data fetched/created/updated successfully',
      data
    };
  } else {
    return {
      success: true,
      message: 'Data fetched/updated successfully',
      data
    };
  }
}