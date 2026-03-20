package org.beh.bulldog.domain.repositories;

import org.beh.bulldog.domain.entities.User;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void deleteById(Long id);
}

