package org.beh.bulldog.domain.repositories;

import org.beh.bulldog.domain.entities.Transaction;
import java.util.Optional;

public interface TransactionRepository {
    Optional<Transaction> findById(Long id);
    Transaction save(Transaction transaction);
    void deleteById(Long id);
}

