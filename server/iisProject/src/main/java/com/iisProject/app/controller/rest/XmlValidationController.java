package com.iisProject.app.controller.rest;

import com.iisProject.app.model.ValidationType;
import com.iisProject.app.service.StudentDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/xml")
public class XmlValidationController {

    public static final Logger logger = LoggerFactory.getLogger(XmlValidationController.class);


    private final StudentDataService studentDataService;

    public XmlValidationController(StudentDataService studentDataService) {
        this.studentDataService = studentDataService;
    }


    @PostMapping("/validateAndSave")
    public ResponseEntity<Map<String, String>> validateAndSaveXml(
            @RequestBody String xmlContent,
            @RequestParam(value = "validationType", defaultValue = "xsd") String validationType) {
        try {
            ValidationType type = ValidationType.valueOf(validationType.toUpperCase());

            studentDataService.validateAndSave(xmlContent, type);

            Map<String, String> response = new HashMap<>();
            response.put("message", "XML is valid.");
            response.put("xmlContent", xmlContent);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("xmlContent", xmlContent);

            return ResponseEntity.badRequest().body(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error: " + e.getMessage());
            response.put("xmlContent", xmlContent);

            return ResponseEntity.status(500).body(response);
        }

    }
}