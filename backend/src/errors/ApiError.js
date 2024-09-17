class ApiError {
  constructor(code, reason = '') {
    this.code = code;
    this.message = reason;
  }
}

module.exports = ApiError;
