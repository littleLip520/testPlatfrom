package com.xforceplus.hades;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@EnableAutoConfiguration
@SpringBootApplication
@EnableEurekaClient
@ComponentScan("com.xforceplus.hades")
@EnableSwagger2
@EnableTransactionManagement
@EnableFeignClients("com.xforceplus.hades")
public class HadesInterface {

    Logger logger = LoggerFactory.getLogger(HadesInterface.class);

    public static void main(String[] args) {
        SpringApplication.run(HadesInterface.class, args);
    }



}
