package org.beh.bulldog.application.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccountDTO {
    private Long id;
    private String bankName;
    private String accountNumber;
    private String accountType;
    private String alias;
    private BigDecimal currentBalance;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

