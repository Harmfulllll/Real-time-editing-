/**
 * Represents an API response.
 */
class apiResponse {
  /**
   * Creates an instance of apiResponse.
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
class apiResponse {
  constructor(statusCode, data, message = "Success") {
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message),
      (this.success = statusCode < 400);
  }
}

export default apiResponse;
