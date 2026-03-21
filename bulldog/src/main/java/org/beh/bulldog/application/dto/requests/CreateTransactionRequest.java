package org.beh.bulldog.application.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransactionRequest {
    @NotNull
    private Long bankAccountId;
    @NotNull
    private String type;
    @NotNull
    private BigDecimal amount;
    @NotNull
    private String category;
    @NotNull
    private String transactionDate;
    private String description;
}
