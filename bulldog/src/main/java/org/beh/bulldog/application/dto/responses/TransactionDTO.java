package org.beh.bulldog.application.dto.responses;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private Long bankAccountId;
    private String type;
    private BigDecimal amount;
    private String category;
    private String transactionDate;
    private String status;
    private String description;
}

