package com.sbsocial.userservice.services;

import com.sbsocial.userservice.domain.User;
import com.sbsocial.userservice.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServices {
    final  private UserRepository userRepository;


    public void create(User user){

        userRepository.save(user);
    }
    public User findOne(UUID id){
        return userRepository.findByIdAndDeletedFalse(id).orElseThrow(()-> new RuntimeException("User dont exist") );
    }
    public User findOneByEmail(String email){
        return userRepository.findByEmailAndDeletedFalse(email).orElseThrow(()-> new RuntimeException("User dont exist") );
    }
}