package org.beh.bulldog.application.ports;

import org.beh.bulldog.domain.value_objects.Password;

public interface UserPasswordEncoder {
    Password encode(String rawPassword);
    boolean matches(String rawPassword, Password encodedPassword);
}
