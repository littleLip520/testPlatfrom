package com.xforceplus.hades.configuration;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = "com.xforceplus.hades.dao")
public class MyBatisConfig {

}
