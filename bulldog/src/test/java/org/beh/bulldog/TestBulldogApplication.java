package org.beh.bulldog;

import org.springframework.boot.SpringApplication;

public class TestBulldogApplication {

  public static void main(String[] args) {
    SpringApplication.from(BulldogApplication::main).with(TestcontainersConfiguration.class)
        .run(args);
  }

}
