package org.beh.bulldog.domain.entities;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.beh.bulldog.domain.value_objects.Email;
import org.beh.bulldog.domain.value_objects.Password;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private Email email;
    private Password password;
    private Set<BankAccount> bankAccounts;
}
