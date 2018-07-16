package util;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 异步返回响应
 * @author
 *
 */
public class Response implements Serializable {
    private String status;
    private String msg;
    private Object data;

    private Map<String, Object> dataMap;

    public Response(String status, String msg, Object data) {
        super();
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    public Response(String status, String msg, Map dataMap) {
        super();
        this.status = status;
        this.msg = msg;
        this.dataMap = dataMap;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    /**
     * 获取数据成功
     * **/
    public static Response successResponse(Object data) {
        return new Response(ConstantsUtil.CommonCode.SUCCESS_CODE, ConstantsUtil.CommonMessage.SUCCESS_MESSAGE, data);
    }

    public static Response successResponse() {
        return new Response(ConstantsUtil.CommonCode.SUCCESS_CODE, ConstantsUtil.CommonMessage.SUCCESS_MESSAGE, "");
    }

    public static Response response(String status, String msg, Object data) {
        return new Response(status, msg, data);
    }

    public static Response response(String status) {
        return new Response(status, "", "");
    }

    public static Response response(String status, String msg) {
        return new Response(status, msg, "");
    }

    public static Response fail(String msg) {
        return new Response(ConstantsUtil.CommonCode.FAILED_CODE, msg, "");
    }

    public static Response success(String msg) {
        return new Response(ConstantsUtil.CommonCode.SUCCESS_CODE, msg, "");
    }

    public static Response fail(String msg, Object data) {
        return new Response(ConstantsUtil.CommonCode.FAILED_CODE, msg, data);
    }

    public static Response success(String msg, Object data) {
        return new Response(ConstantsUtil.CommonCode.SUCCESS_CODE, msg, data);
    }

    public Map<String, Object> getDataMap() {
        return dataMap;
    }

    public void setDataMap(Map<String, Object> dataMap) {
        this.dataMap = dataMap;
    }

    public Response dataMap(String name, Object value) {
        if (this.dataMap == null) {
            this.dataMap = new HashMap<String, Object>();
        }
        this.dataMap.put(name, value);
        return this;
    }

}
