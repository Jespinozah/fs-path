package org.beh.bulldog.application.use_cases;

import java.util.List;
import org.beh.bulldog.application.dto.responses.TransactionDTO;

public interface GetAccountTransactionsUseCase {
    List<TransactionDTO> execute(Long accountId);
}
