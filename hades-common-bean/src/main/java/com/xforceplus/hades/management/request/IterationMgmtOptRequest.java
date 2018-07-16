package com.xforceplus.hades.management.request;

import lombok.Data;

import java.util.Date;

@Data
public class IterationMgmtOptRequest {
    private Integer id;

    private String iterationName;

    private Integer producId;

    private String pmName;

    private String devOwner;

    private String testOwner;

    private String reqQuantity;

    private Date planDate;

    private Date actualDate;

    private Integer externalId;

    private Integer exceptionEventId;

    private Integer status;

    private String creater;

    private Date createTime;

    private Date dateChangeLastTime;

    private String testMem;
}
