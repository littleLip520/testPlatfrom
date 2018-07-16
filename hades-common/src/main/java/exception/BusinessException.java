package exception;

/**
 * 业务异常
 * 
 * @author chenghaiyang
 */
public class BusinessException extends Exception {
	private static final long serialVersionUID = 1977620482890112012L;
	/**
	 * 异常代码
	 */
	private String errorCode;
	/**
	 * 异常描述
	 */
	private String errorDesc;

	public BusinessException() {
		super();
	}

	public BusinessException(Throwable t) {
		super(t);
	}

	public BusinessException(String code, String message, Throwable t) {
		super(t);
		this.errorCode = code;
		this.errorDesc = message;
	}

	public BusinessException(String code, String message) {
		this(code, message, null);
	}

	public BusinessException(String message) {
		this(null, message);
	}

	public BusinessException(String message, Throwable t) {
		this(null, message, t);
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorDesc() {
		return errorDesc;
	}

	public void setErrorDesc(String errorDesc) {
		this.errorDesc = errorDesc;
	}

}
