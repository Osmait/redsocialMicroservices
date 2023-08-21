package com.sbsocial.userservice.infraestruture.utils;

import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.ArrayList;
import java.util.List;

@Component
public class ValidateErrors {

    public List<String> ValidFields(BindingResult result){

        List<String>errors = new ArrayList<>();

        for (FieldError error: result.getFieldErrors()){
            errors.add(error.getDefaultMessage());
        }
        return errors;
    }
}