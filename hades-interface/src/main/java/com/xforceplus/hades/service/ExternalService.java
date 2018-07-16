package com.xforceplus.hades.service;

import com.xforceplus.hades.management.response.ServiceListResponse;
import com.xforceplus.hades.management.response.SystemListResponse;
import com.xforceplus.hades.util.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
@FeignClient(value = "hades-management")
public interface ExternalService {

    @GetMapping("/api/v1/systems/listAll")
    public Response<SystemListResponse> getSystemList();

   /* @PostMapping("/api/v1/services/bySystem/{id}")
    public Response<ServiceListResponse> getServiceInfo(Integer id);*/
   @GetMapping("/api/v1/services/listAll")
    public Response<ServiceListResponse> getServiceList();



}
