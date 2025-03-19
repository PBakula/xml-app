package com.iisProject.app.service;

import com.iisProject.app.dto.StudentDataDTO;
import com.iisProject.app.dto.StudentsDataDTO;
import com.iisProject.app.model.ValidationType;
import jakarta.xml.bind.JAXBException;

import java.util.List;

public interface StudentDataService {


    List<StudentDataDTO> findAll();
    void saveStudent(StudentDataDTO studentDataDto);
    StudentsDataDTO mapXmlToDto(String xml) throws JAXBException;
    List<StudentDataDTO> findByGpa(double gpa);
    String generateXml(List<StudentDataDTO> students) throws JAXBException;
    String filterXmlWithXPath(String xml, String xPathExpression) throws Exception;
    void validateAndSave(String xmlContent, ValidationType validationType);
}