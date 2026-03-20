package org.beh.bulldog.domain.value_objects;


import org.beh.bulldog.domain.exceptions.InvalidPasswordException;

public record Password(String hashedValue) {

  public Password {
    if (hashedValue == null || hashedValue.isBlank()) {
      throw new InvalidPasswordException("Password hash cannot be null or empty");
    }
    if (hashedValue.length() < 60) { // BCrypt hash length
      throw new InvalidPasswordException("Invalid password hash format");
    }
  }

  /**
   * Create Password from hashed string
   */
  public static Password of(String hashedPassword) {
    return new Password(hashedPassword);
  }

  /**
   * Get hashed password
   */
  public String getHashedValue() {
    return hashedValue;
  }

  @Override
  public String toString() {
    return "****"; // Never expose the actual hash
  }
}