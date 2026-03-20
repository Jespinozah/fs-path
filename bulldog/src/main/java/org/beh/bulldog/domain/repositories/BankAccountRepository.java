package org.beh.bulldog.domain.repositories;

import org.beh.bulldog.domain.entities.BankAccount;
import java.util.Optional;

public interface BankAccountRepository {
    Optional<BankAccount> findById(Long id);
    BankAccount save(BankAccount account);
    void deleteById(Long id);
}

