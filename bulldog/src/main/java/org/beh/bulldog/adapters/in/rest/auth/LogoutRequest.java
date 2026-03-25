package org.beh.bulldog.adapters.in.rest.auth;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(
    @NotBlank String refreshToken
) {
}

