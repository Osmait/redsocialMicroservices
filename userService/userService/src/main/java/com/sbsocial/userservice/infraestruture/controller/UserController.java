package com.sbsocial.userservice.infraestruture.controller;

import com.sbsocial.userservice.domain.User;
import com.sbsocial.userservice.infraestruture.dto.UserDto;
import com.sbsocial.userservice.infraestruture.dto.UserResponse;
import com.sbsocial.userservice.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.QueryParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

  final private UserServices userServices;

  @GetMapping("/{id}")
  public ResponseEntity<User> getUser(@PathVariable("id") UUID id) {
    User user = userServices.findOne(id);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<String> postUser(@RequestBody UserDto userRequest) {
    userServices.create(userRequest);
    return new ResponseEntity<>("Created", HttpStatus.CREATED);
  }

  @GetMapping("/email")
  public ResponseEntity<User> getUserByEmail(@RequestParam("email") String email) {
    if (email == null) {
      throw new RuntimeException("Error Email Is required");
    }
    User user = userServices.findOneByEmail(email);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @CrossOrigin
  @GetMapping("/profile/{id}")
  public ResponseEntity<UserResponse> Profile(@PathVariable("id") UUID id) {
    UserResponse user = userServices.findProfile(id);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @CrossOrigin
  @GetMapping("/find")
  public ResponseEntity<List<User>> FindUsersByName(@RequestParam("name") String name) {
    List<User> list = userServices.findUsersByName(name);
    return new ResponseEntity<>(list, HttpStatus.OK);
  }

}
