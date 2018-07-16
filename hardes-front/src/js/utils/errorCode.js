class ErrorCode {
  constructor(code, msg) {
    this.code = code;
    this.msg = msg;
  }
  getCode() { return this.code; }
  getMsg() { return this.msg; }
}

ErrorCode.NOTFOUND = new ErrorCode(404, 'Not found');
ErrorCode.BADREQUEST = new ErrorCode(400, 'Bad Request');
ErrorCode.UNSUPPORTEDMEDIATYPE = new ErrorCode(415, 'UnSupported Media type');
ErrorCode.UNAUTHORIZED = new ErrorCode(401, 'Unauthorized');
ErrorCode.FORBIDDEN = new ErrorCode(403, 'Forbidden');
ErrorCode.METHODNOTALLOWD = new ErrorCode(405, 'Method Not Allowed');
ErrorCode.TIMEOUT = new ErrorCode(408, 'Request timeout');
ErrorCode.SERVERDOWN = new ErrorCode(500, 'Internal server error');
ErrorCode.UNKNOWNERROR = new ErrorCode(600, 'Network error');
ErrorCode.ABORTED = new ErrorCode(601, 'Promise aborted');
Object.freeze(ErrorCode);

const err = (error) => {
  let errCode = '';
  switch (error) {
    case 400:
    errCode = ErrorCode.BADREQUEST;
    break;
    case 401:
      errCode = ErrorCode.UNAUTHORIZED;
      break;
    case 403:
      errCode = ErrorCode.FORBIDDEN;
      break;
    case 404:
      errCode = ErrorCode.NOTFOUND;
      break;
    case 408:
      errCode = ErrorCode.TIMEOUT;
      break;
    case 415:
      errCode = ErrorCode.UNSUPPORTEDMEDIATYPE;
      break;
    case 500:
      errCode = ErrorCode.SERVERDOWN;
      break;
    default:
      errCode = ErrorCode.UNKNOWNERROR;
  }
  return {
    errorCode: errCode.getCode(),
    errorMsg: errCode.getMsg(),
  };
};
export {
  ErrorCode,
  err,
};

