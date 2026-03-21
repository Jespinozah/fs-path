package org.beh.bulldog.application.ports;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}

