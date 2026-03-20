package org.beh.bulldog.domain.exceptions;

public class InvalidTransactionException extends DomainException {
    public InvalidTransactionException(String message) {
        super(message);
    }
}

