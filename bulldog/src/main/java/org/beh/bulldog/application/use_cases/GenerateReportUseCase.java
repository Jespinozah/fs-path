package org.beh.bulldog.application.use_cases;

import org.beh.bulldog.application.dto.requests.ReportRequest;
import org.beh.bulldog.application.dto.responses.ReportDTO;

public interface GenerateReportUseCase {
    ReportDTO execute(ReportRequest request);
}
