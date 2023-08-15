package com.sbsocial.userservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User,UUID> {

    public Optional<User>findByIdAndDeletedFalse(UUID id);
    public Optional<User>findByEmailAndDeletedFalse(String email);

}
