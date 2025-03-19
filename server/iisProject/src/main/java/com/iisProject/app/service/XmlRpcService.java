package com.iisProject.app.service;

import java.util.List;

public interface XmlRpcService {

    List<String> getMatchingCities(String cityName) throws Exception;
    String getTemperature(String cityName) throws Exception;
}
