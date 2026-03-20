package org.beh.bulldog.domain.services;

import org.beh.bulldog.domain.entities.Transaction;
import org.beh.bulldog.domain.entities.BankAccount;
import org.beh.bulldog.domain.exceptions.DomainException;

public class TransactionValidationService {
    public void validate(Transaction transaction, BankAccount account) throws DomainException {
        // TODO: Implement validation logic
    }
}

