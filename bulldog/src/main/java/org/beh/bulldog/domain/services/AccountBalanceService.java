package org.beh.bulldog.domain.services;

import org.beh.bulldog.domain.entities.BankAccount;
import org.beh.bulldog.domain.value_objects.Money;

public class AccountBalanceService {
    public Money calculateBalance(BankAccount account) {
        // TODO: Implement balance calculation logic
        return account.getBalance();
    }
}

