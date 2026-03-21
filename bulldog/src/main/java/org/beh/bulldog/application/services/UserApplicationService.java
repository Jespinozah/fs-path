package org.beh.bulldog.application.services;

import org.beh.bulldog.domain.entities.User;
import org.beh.bulldog.domain.value_objects.Email;
import org.beh.bulldog.domain.value_objects.Password;
import org.beh.bulldog.domain.repositories.UserRepository;
import org.beh.bulldog.application.dto.requests.CreateUserRequest;
import org.beh.bulldog.application.dto.requests.UpdateUserRequest;
import org.beh.bulldog.application.dto.requests.ChangePasswordRequest;
import org.beh.bulldog.application.dto.responses.UserDTO;
import org.beh.bulldog.application.dto.responses.UserDetailDTO;
import org.beh.bulldog.application.mappers.UserMapper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserApplicationService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    // Add other dependencies as needed

    public UserDTO createUser(CreateUserRequest request) {
        Email email = userMapper.toEmail(request.getEmail());
        // Password encoding and domain logic omitted for brevity
        User user = User.builder()
            .name(request.getName())
            .email(email)
            .password(null) // Set encoded password
            .build();
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return userMapper.toDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDetailDTO getUserDetails(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return userMapper.toDetailDTO(user);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllActiveUsers() {
        return userRepository.findAll().stream().map(userMapper::toDTO).collect(Collectors.toList());
    }

    public UserDTO updateUserProfile(Long userId, UpdateUserRequest request) {
        // TODO: Implement update logic
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        // TODO: Implement password change logic
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deactivateUser(Long userId) {
        // TODO: Implement deactivate logic
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void activateUser(Long userId) {
        // TODO: Implement activate logic
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
