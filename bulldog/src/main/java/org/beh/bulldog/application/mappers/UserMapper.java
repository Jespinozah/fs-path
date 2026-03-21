package org.beh.bulldog.application.mappers;

import org.springframework.stereotype.Component;
import org.beh.bulldog.application.dto.responses.UserDetailDTO;
import org.beh.bulldog.application.dto.responses.UserDTO;
import org.beh.bulldog.domain.entities.User;
import org.beh.bulldog.domain.value_objects.Email;

@Component
public class UserMapper {
    public Email toEmail(String emailString) {
        return Email.of(emailString);
    }

    public UserDTO toDTO(User user) {
        if (user == null) return null;
        return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail() != null ? user.getEmail().toString() : null)
            .age(user.getAge())
            .isActive(user.getIsActive())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    public UserDetailDTO toDetailDTO(User user) {
        if (user == null) return null;
        return UserDetailDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail() != null ? user.getEmail().toString() : null)
            .age(user.getAge())
            .isActive(user.getIsActive())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .totalAccounts(user.getBankAccounts() != null ? user.getBankAccounts().size() : 0)
            .build();
    }
}
