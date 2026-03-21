package org.beh.bulldog.adapters.out.persistence;

import org.beh.bulldog.domain.entities.User;
import org.beh.bulldog.domain.repositories.UserRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public class UserRepositoryImpl implements UserRepository {
    // TODO: Inject your JPA EntityManager or Spring Data JPA repository here

    @Override
    public Optional<User> findById(Long id) {
        // TODO: Implement with JPA logic
        return Optional.empty();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        // TODO: Implement with JPA logic
        return Optional.empty();
    }

    @Override
    public User save(User user) {
        // TODO: Implement with JPA logic
        return user;
    }

    @Override
    public List<User> findAll() {
        // TODO: Implement with JPA logic
        return Collections.emptyList();
    }

    @Override
    public void deleteById(Long id) {
        // TODO: Implement with JPA logic
    }
}

