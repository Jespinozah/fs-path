package org.beh.bulldog.domain.exceptions;

public class InvalidPasswordException extends DomainException {

  public InvalidPasswordException(String message) {
    super(message);
  }
}
