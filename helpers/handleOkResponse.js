// Here we define helpers functions to handle successful response

export function okResponse(data) {
  return {
    success: true,
    data: data
  };
}