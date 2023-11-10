package com.sbsocial.userservice.infraestruture.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String name,
    String lastName,
    String email,
    String address,
    String phone,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {
}
