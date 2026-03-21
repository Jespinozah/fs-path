package org.beh.bulldog.adapters.in.rest;

import org.beh.bulldog.application.dto.requests.ChangePasswordRequest;
import org.beh.bulldog.application.dto.requests.CreateUserRequest;
import org.beh.bulldog.application.dto.requests.UpdateUserRequest;
import org.beh.bulldog.application.dto.responses.UserDTO;
import org.beh.bulldog.application.dto.responses.UserDetailDTO;
import org.beh.bulldog.application.services.UserApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserApplicationService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO userDTO = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<UserDetailDTO> getUserDetails(@PathVariable Long id) {
        UserDetailDTO userDetailDTO = userService.getUserDetails(id);
        return ResponseEntity.ok(userDetailDTO);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllActiveUsers() {
        List<UserDTO> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        UserDTO userDTO = userService.updateUserProfile(id, request);
        return ResponseEntity.ok(userDTO);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<UserDTO> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
