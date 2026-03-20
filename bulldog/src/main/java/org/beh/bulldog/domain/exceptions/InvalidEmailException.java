package org.beh.bulldog.domain.exceptions;

public class InvalidEmailException extends DomainException {

  public InvalidEmailException(String message) {
    super(message);
  }
}
