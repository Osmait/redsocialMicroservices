package com.sbsocial.userservice.services;

import com.sbsocial.userservice.domain.User;
import com.sbsocial.userservice.domain.UserRepository;
import com.sbsocial.userservice.infraestruture.dto.UserDto;
import com.sbsocial.userservice.infraestruture.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServicesTest {

    @InjectMocks
    private UserServices userServices;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp(){
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void create() {

        UserDto userDto = new UserDto();
        userDto.setName("saul");
        userDto.setEmail("saulburgos@gmail.com");
        userDto.setLastName("burgos");
        userDto.setPassword("123456");
        userDto.setAddress("santiago");
        userDto.setPhone("12353453");

        when(userRepository.findByEmailAndDeletedFalse(userDto.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(userDto.getPassword())).thenReturn("hashedPassword");

        userServices.create(userDto);

        verify(userRepository).findByEmailAndDeletedFalse(userDto.getEmail());
        verify(passwordEncoder).encode(userDto.getPassword());
        verify(userRepository).save(any(User.class));

    }

    @Test
    void findOne() {

        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setName("saul");
        user.setLastName("burgos");
        user.setPassword("1223455");
        user.setAddress("santiago");


        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.of(user));

        User resultUser = userServices.findOne(userId);


        assertEquals(user, resultUser);
    }

    @Test
    void findOneByEmail() {

        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setName("saul");
        user.setLastName("burgos");
        user.setPassword("1223455");
        user.setAddress("santiago");
        user.setEmail("saulburgos@gmail.com");


        when(userRepository.findByEmailAndDeletedFalse(user.getEmail())).thenReturn(Optional.of(user));

        User resultUser = userServices.findOneByEmail(user.getEmail());


        assertEquals(user, resultUser);
    }

    @Test
    void findProfile() {

        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setName("Profile User");
        user.setLastName("Last Name");
        user.setEmail("profile@example.com");
        user.setPhone("1234567890");
        user.setAddress("789 Elm St");

        // Mock the userRepository to return an Optional with the user when findByIdAndDeletedFalse is called
        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.of(user));

        // Call the findProfile method
        UserResponse userResponse = userServices.findProfile(userId);

        // Verify that the UserResponse contains the expected values
        assertEquals(userId, userResponse.id());
        assertEquals(user.getName(), userResponse.name());
        assertEquals(user.getLastName(), userResponse.LastName());
    
        assertEquals(user.getPhone(), userResponse.phone());
        assertEquals(user.getAddress(), userResponse.address());
    }
}