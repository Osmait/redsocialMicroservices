package com.sbsocial.userservice.services;

import com.sbsocial.userservice.domain.User;
import com.sbsocial.userservice.domain.UserRepository;
import com.sbsocial.userservice.infraestruture.dto.UserDto;
import com.sbsocial.userservice.infraestruture.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServices {
    final  private UserRepository userRepository;
    final private PasswordEncoder passwordEncoder;


    public void create(UserDto user){
        User userDb =  userRepository.findByEmailAndDeletedFalse(user.getEmail()).orElse(new User());

        if (Objects.equals(userDb.getEmail(), user.getEmail())){
            throw  new RuntimeException("Email; Exist");
        }
        User userSave =  user.getUserFromDto();
        userSave.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(userSave);
    }
    public User findOne(UUID id){
        return userRepository.findByIdAndDeletedFalse(id).orElseThrow(()-> new RuntimeException("User dont exist") );
    }
    public User findOneByEmail(String email){
        return userRepository.findByEmailAndDeletedFalse(email).orElseThrow(()-> new RuntimeException("User dont exist") );
    }
    public UserResponse findProfile(UUID id){
        User user =  userRepository.findByIdAndDeletedFalse(id).orElseThrow(()-> new RuntimeException("User dont exist") );
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getCreateAt(),
                user.getUpdateAt()
        );

    }
}
