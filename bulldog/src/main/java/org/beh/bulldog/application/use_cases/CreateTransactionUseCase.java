package org.beh.bulldog.application.use_cases;

import org.beh.bulldog.application.dto.requests.CreateTransactionRequest;
import org.beh.bulldog.application.dto.responses.TransactionDTO;

public interface CreateTransactionUseCase {
    TransactionDTO execute(CreateTransactionRequest request);
}
