package com.sbsocial.userservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User,UUID> {

    public Optional<User>findByIdAndDeletedFalse(UUID id);
    public Optional<User>findByEmailAndDeletedFalse(String email);

//    public  Optional<List<User>>findAllByNameContainingAndDeletedFalse(String name);
    @Query("SELECT u FROM User u WHERE u.name LIKE %:pattern%")
    public  Optional<List<User>>findByName(String pattern);
}