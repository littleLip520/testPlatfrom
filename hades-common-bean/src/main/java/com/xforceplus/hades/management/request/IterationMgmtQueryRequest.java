package com.xforceplus.hades.management.request;

import lombok.Data;

@Data
public class IterationMgmtQueryRequest {
    private int productId;
    private int status;
    private String iterationName;
    private String testOwner;
}
