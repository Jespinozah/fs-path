package org.beh.bulldog.application.ports;

public interface NotificationService {
    void notifyUser(Long userId, String message);
}

