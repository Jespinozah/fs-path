package org.beh.bulldog.domain.entities;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.beh.bulldog.domain.value_objects.Money;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transfer {
    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private Money amount;
    private LocalDateTime timestamp;
    private String description;
}

