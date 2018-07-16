package com.xforceplus.hades.exception;

import com.xforceplus.hades.util.Response;
import org.mybatis.spring.MyBatisSystemException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartException;

import java.sql.SQLException;

@ControllerAdvice
class GlobalExceptionHandler {

    Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response exceptionHandler(NullPointerException e){
        logger.error("空指针异常", e);
        return Response.fail("空指针异常");
    }

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response exceptionHandler(ArithmeticException e){
        logger.error("运算异常", e);
        return Response.fail("运算异常");
    }

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public Response exceptionHandler(MultipartException e){
        logger.error("文件大小超过限制", e);
        return Response.fail("文件大小超过限制");
    }

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response exceptionHandler(SQLException e){
        logger.error("sql执行异常", e);
        return Response.fail("sql执行异常");
    }

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response exceptionHandler(MyBatisSystemException e){
        logger.error("mybatis异常", e);
        return Response.fail("mybatis异常");
    }

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Response exceptionHandler(MethodArgumentNotValidException e){
        logger.error("参数不合法异常", e);
        return Response.fail("参数不合法异常");
    }




}