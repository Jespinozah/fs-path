package org.beh.bulldog.application.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequest {
    private Long userId;
    private String reportType;
    private String fromDate;
    private String toDate;
}

