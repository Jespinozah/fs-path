package org.beh.bulldog.domain.value_objects;

import java.util.regex.Pattern;
import org.beh.bulldog.domain.exceptions.InvalidEmailException;

public record Email(String value) {

  public static final Pattern EMAIL_PATTERN = Pattern.compile(
      "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$"
  );


  /**
   *  Constructor
   * Validates the email format using a regular expression.
   */
  public Email {
    if (value == null || value.isBlank()) {
      throw new InvalidEmailException("Email cannot be null or blank");
    }

    if(!EMAIL_PATTERN.matcher(value).matches()) {
      throw new InvalidEmailException("Invalid email format: " + value);
    }
  }

  /**
   * Create an Email value object from a string value.
   */
  public static Email of(String value) {
    return new Email(value);
  }

  @Override
  public String toString() {
    return value;
  }
}