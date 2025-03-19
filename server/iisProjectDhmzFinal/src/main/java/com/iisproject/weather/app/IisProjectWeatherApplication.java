package com.iisproject.weather.app;

import com.iisproject.weather.app.service.XmlRpcService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class IisProjectWeatherApplication {

    private final XmlRpcService xmlRpcService;

    public IisProjectWeatherApplication(XmlRpcService xmlRpcService) {
        this.xmlRpcService = xmlRpcService;
    }

    public static void main(String[] args) {
        SpringApplication.run(IisProjectWeatherApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void startServer() {
        xmlRpcService.startXmlRpcServer();
    }
}
