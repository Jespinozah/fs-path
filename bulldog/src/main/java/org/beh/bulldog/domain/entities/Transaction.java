package org.beh.bulldog.domain.entities;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.beh.bulldog.domain.value_objects.Money;
import org.beh.bulldog.domain.value_objects.TransactionType;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private Long id;
    private Money amount;
    private TransactionType type;
    private LocalDateTime timestamp;
    private String description;
}

