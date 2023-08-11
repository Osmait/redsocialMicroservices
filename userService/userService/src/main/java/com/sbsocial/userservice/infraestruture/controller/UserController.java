package com.sbsocial.userservice.infraestruture.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {



    @GetMapping
    public String getUser(){
        return "List of User";
    }

    @PostMapping
    public String postUser(){
        return "Created";
    }


}
