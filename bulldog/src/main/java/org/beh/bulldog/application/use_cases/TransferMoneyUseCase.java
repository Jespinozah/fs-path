package org.beh.bulldog.application.use_cases;

import org.beh.bulldog.application.dto.requests.CreateTransferRequest;
import org.beh.bulldog.application.dto.responses.TransferDTO;

public interface TransferMoneyUseCase {
    TransferDTO execute(CreateTransferRequest request);
}
