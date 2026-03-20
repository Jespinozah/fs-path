package org.beh.bulldog.domain.entities;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.beh.bulldog.domain.value_objects.AccountStatus;
import org.beh.bulldog.domain.value_objects.Money;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {
    private Long id;
    private String accountNumber;
    private Money balance;
    private AccountStatus status;
    private Set<Transaction> transactions;
}
