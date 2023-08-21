package com.sbsocial.userservice.infraestruture.dto;

import com.sbsocial.userservice.domain.User;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


@Data
public class UserDto {

    @NotNull(message = "Name is require")
    @Size(min = 1,max = 50,message = "Name is require")
    private String name;

    @NotNull(message = "LastName is require")
    @Size(min = 1,max = 50, message ="LastName is require" )
    private String lastName;

    @Email(message = "the field not is a email")
    @NotNull(message = "Email is require")
    @Size(min = 1,max = 50,message = "Email is require")
    private String email;

    private String phone;

    @NotNull(message = "Address is require")
    private String address;

    @NotNull(message = "password is require")
    @Size(min = 6, max = 20, message = "Password length  min 6")
    private String password;

    public User getUserFromDto(){
        User user = new User();
        user.setName(name);
        user.setAddress(address);
        user.setPhone(phone);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password);
        return  user;
    }
}
