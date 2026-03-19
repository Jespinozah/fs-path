# Java 21 Backend - Hexagonal Architecture Dependencies

**Java Version:** 21 LTS  
**Spring Boot Version:** 3.2.0+  
**Build Tool:** Maven

---

## Project Structure

```
bulldog-api/
├── domain/                          # Core business logic (no dependencies)
│   ├── entities/                    # Domain entities
│   ├── value-objects/               # Value objects
│   ├── repositories/                # Repository interfaces
│   ├── services/                    # Domain services
│   └── exceptions/                  # Domain exceptions
│
├── application/                     # Use cases & application logic
│   ├── dto/                         # Data Transfer Objects
│   ├── mappers/                     # DTOs mapping
│   ├── services/                    # Application services
│   ├── use-cases/                   # Use case implementations
│   └── ports/                       # Port interfaces
│
├── adapters/
│   ├── in/                          # Input adapters
│   │   ├── rest/                    # REST Controllers
│   │   ├── config/                  # REST configuration
│   │   └── exception-handlers/      # Global exception handling
│   │
│   └── out/                         # Output adapters
│       ├── persistence/             # JPA Repositories
│       ├── entities/                # JPA Entities
│       └── mappers/                 # Entity to Domain mappers
│
├── config/                          # Spring configuration
│   ├── SecurityConfig.java
│   ├── CacheConfig.java
│   ├── DatabaseConfig.java
│   └── SwaggerConfig.java
│
├── BulldogApplication.java          # Main Spring Boot class
└── pom.xml
```

---

## Parent POM & BOM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.bulldog</groupId>
    <artifactId>bulldog-api</artifactId>
    <version>1.0.0</version>
    <name>Bulldog Personal Finance API</name>
    <description>Multi-account personal finance management system</description>
    <url>https://github.com/bulldog/api</url>

    <properties>
        <!-- Java 21 LTS -->
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <!-- Dependency Versions -->
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <springdoc.version>2.1.0</springdoc.version>
        <jjwt.version>0.12.3</jjwt.version>
        <testcontainers.version>1.19.6</testcontainers.version>
        <apache-commons.version>3.14.0</apache-commons.version>
        <guava.version>33.0.0-jre</guava.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>2023.0.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- =============================================== -->
        <!-- SPRING BOOT STARTERS                             -->
        <!-- =============================================== -->

        <!-- Web & REST -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Cache -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>

        <!-- Actuator (Monitoring) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- Spring HATEOAS (Hypermedia) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-hateoas</artifactId>
        </dependency>

        <!-- =============================================== -->
        <!-- DATABASE & ORM                                  -->
        <!-- =============================================== -->

        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.2.0</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Hibernate Validator -->
        <dependency>
            <groupId>org.hibernate.validator</groupId>
            <artifactId>hibernate-validator</artifactId>
        </dependency>

        <!-- Flyway (Database Migrations) -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
            <version>9.22.3</version>
        </dependency>

        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-mysql</artifactId>
            <version>9.22.3</version>
        </dependency>

        <!-- =============================================== -->
        <!-- SECURITY & JWT                                  -->
        <!-- =============================================== -->

        <!-- JJWT (JWT Library) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- =============================================== -->
        <!-- MAPPING & DTO TRANSFORMATION                    -->
        <!-- =============================================== -->

        <!-- MapStruct (Object Mapping) -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>

        <!-- Lombok (Annotations) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Lombok-MapStruct Binding -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok-mapstruct-binding</artifactId>
            <version>0.2.0</version>
        </dependency>

        <!-- =============================================== -->
        <!-- API DOCUMENTATION                               -->
        <!-- =============================================== -->

        <!-- SpringDoc OpenAPI (Swagger 3) -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>

        <!-- =============================================== -->
        <!-- ERROR HANDLING                                  -->
        <!-- =============================================== -->

        <!-- Problem Spring Web -->
        <dependency>
            <groupId>org.zalando</groupId>
            <artifactId>problem-spring-web</artifactId>
            <version>0.29.1</version>
        </dependency>

        <dependency>
            <groupId>org.zalando</groupId>
            <artifactId>problem-jackson-datatype</artifactId>
            <version>0.29.1</version>
        </dependency>

        <!-- =============================================== -->
        <!-- CACHING                                         -->
        <!-- =============================================== -->

        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- Jedis (Redis Client) -->
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
        </dependency>

        <!-- =============================================== -->
        <!-- MONITORING & LOGGING                            -->
        <!-- =============================================== -->

        <!-- Micrometer Prometheus -->
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>

        <!-- =============================================== -->
        <!-- UTILITY LIBRARIES                               -->
        <!-- =============================================== -->

        <!-- Apache Commons Lang -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>${apache-commons.version}</version>
        </dependency>

        <!-- Google Guava -->
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
            <version>${guava.version}</version>
        </dependency>

        <!-- =============================================== -->
        <!-- TEST DEPENDENCIES                               -->
        <!-- =============================================== -->

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Spring Security Test -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- JUnit 5 -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Mockito -->
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- AssertJ (Fluent Assertions) -->
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- REST Assured (API Testing) -->
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- TestContainers -->
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>testcontainers</artifactId>
            <version>${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>mysql</artifactId>
            <version>${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- H2 Database (In-memory for testing) -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <!-- Spring Boot Maven Plugin -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

            <!-- Maven Compiler Plugin (Java 21) -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>21</source>
                    <target>21</target>
                    <release>21</release>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>1.18.30</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>${mapstruct.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>

            <!-- Maven Surefire Plugin (Testing) -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.1.2</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*Tests.java</include>
                    </includes>
                </configuration>
            </plugin>

            <!-- JaCoCo (Code Coverage) -->
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>0.8.10</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <phase>test</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!-- Maven Checkstyle Plugin (Code Quality) -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-checkstyle-plugin</artifactId>
                <version>3.3.1</version>
                <configuration>
                    <configLocation>checkstyle.xml</configLocation>
                    <consoleOutput>true</consoleOutput>
                    <failsOnError>false</failsOnError>
                </configuration>
            </plugin>

        </plugins>
    </build>

</project>
```

---

## Java 21 Features to Leverage

### 1. Virtual Threads (Project Loom)

```java
// In your application service
@Service
public class TransactionService {

    @Async
    public CompletableFuture<TransactionDTO> createTransactionAsync(
            CreateTransactionRequest request) {
        // Virtual threads handle this efficiently
        return CompletableFuture.completedFuture(
            createTransaction(request)
        );
    }
}
```

### 2. Records (for DTOs)

```java
// application/dto/transactions/TransactionDTO.java
public record TransactionDTO(
    Long id,
    Long bankAccountId,
    TransactionType type,
    BigDecimal amount,
    String category,
    LocalDate transactionDate,
    LocalTime transactionTime,
    String description
) {}

// Request/Response
public record CreateTransactionRequest(
    TransactionType transactionType,
    BigDecimal amount,
    String category,
    String description,
    String referenceNumber,
    LocalDate transactionDate,
    LocalTime transactionTime,
    String notes
) {}
```

### 3. Sealed Classes (for Domain Types)

```java
// domain/entities/transactions/Transaction.java
public abstract sealed class Transaction
    permits DepositTransaction, WithdrawalTransaction, TransferTransaction {

    protected Long id;
    protected BigDecimal amount;
    protected LocalDate transactionDate;

    abstract BigDecimal calculateFees();
}

public final class DepositTransaction extends Transaction {
    @Override
    BigDecimal calculateFees() {
        return BigDecimal.ZERO;
    }
}

public final class WithdrawalTransaction extends Transaction {
    @Override
    BigDecimal calculateFees() {
        return amount.multiply(new BigDecimal("0.001")); // 0.1%
    }
}
```

### 4. Pattern Matching (Enhanced Switch)

```java
// Application service
@Service
public class ReportService {

    public ReportDTO generateReport(ReportRequest request) {
        return switch (request) {
            case MonthlyReportRequest monthly ->
                generateMonthlyReport(monthly.year(), monthly.month());
            case YearlyReportRequest yearly ->
                generateYearlyReport(yearly.year());
            case CustomRangeReportRequest custom ->
                generateCustomReport(custom.startDate(), custom.endDate());
            default -> throw new IllegalArgumentException("Unknown report type");
        };
    }
}
```

### 5. Text Blocks (for SQL/Multi-line strings)

```java
// infrastructure/persistence/TransactionRepositoryImpl.java
@Repository
public class TransactionRepositoryImpl {

    private static final String QUERY = """
        SELECT t FROM Transaction t
        WHERE t.bankAccount.user.id = :userId
            AND t.transactionDate BETWEEN :startDate AND :endDate
            AND t.status = :status
        ORDER BY t.transactionDate DESC
        """;
}
```

---

## application.yml Configuration for Java 21

```yaml
# filepath: src/main/resources/application.yml

spring:
  application:
    name: bulldog-api
    version: 1.0.0

  # DataSource Configuration
  datasource:
    url: jdbc:mysql://localhost:3306/bulldog_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000

  # JPA/Hibernate Configuration
  jpa:
    database-platform: org.hibernate.dialect.MySQLDialect
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        jdbc:
          batch_size: 20
          fetch_size: 50
        order_inserts: true
        order_updates: true

  # Flyway Database Migration
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  # Cache Configuration (Redis)
  cache:
    type: redis
    redis:
      time-to-live: 600000  # 10 minutes
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    timeout: 5000
    jedis:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1ms

  # Security
  security:
    user:
      name: admin
      password: admin123

  # Jackson Configuration
  jackson:
    default-property-inclusion: non_null
    serialization:
      write-dates-as-timestamps: false
    deserialization:
      fail-on-unknown-properties: false

  # Servlet Configuration
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# Server Configuration
server:
  servlet:
    context-path: /api
  port: 8080
  shutdown: graceful
  compression:
    enabled: true
    min-response-size: 1024

# Logging Configuration
logging:
  level:
    root: INFO
    com.bulldog: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d %p %c{1.} [%t] %m%n"
  file:
    name: logs/bulldog.log

# Actuator Configuration (Monitoring)
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info,threaddump
      base-path: /actuator
  endpoint:
    health:
      show-details: always
    metrics:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true

# SpringDoc OpenAPI Configuration
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    show-common-extensions: true
  api-docs:
    path: /v3/api-docs
  use-fqn: true

# JWT Configuration
app:
  jwt:
    secret: ${JWT_SECRET:your-secret-key-change-in-production}
    expiration: 900000  # 15 minutes
    refresh-expiration: 604800000  # 7 days
    header: Authorization
    prefix: Bearer

# Custom Application Properties
app:
  api:
    version: v1
    base-path: /api/v1
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    allowed-headers: "*"
    allow-credentials: true
    max-age: 3600
```

---

## Docker Configuration for Java 21

### Dockerfile

```dockerfile
# Multi-stage build for optimized image
FROM eclipse-temurin:21-jdk-jammy as builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/bulldog-api-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
    "-XX:+UseG1GC", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: bulldog_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      timeout: 5s
      retries: 10

  bulldog-api:
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_USERNAME: root
      DB_PASSWORD: password
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: your-secret-key-change-in-production
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/actuator/health"]
      timeout: 5s
      retries: 10

volumes:
  mysql_data:
```

---

## Build & Run Commands

### Development

```bash
# Clean and build
mvn clean install

# Run with Maven
mvn spring-boot:run

# Run tests with coverage
mvn clean test jacoco:report

# View coverage at: target/site/jacoco/index.html
```

### Production Build

```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR
java -Xmx1g -Xms512m -jar target/bulldog-api-1.0.0.jar

# Run with Docker
docker-compose up -d
```

### Development Profile

```bash
# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Run tests
mvn test -Dspring.profiles.active=test
```

---

## IDE Configuration (IntelliJ IDEA)

**File → Project Structure → Project**

- SDK: temurin-21
- Language level: 21

**File → Project Structure → Modules**

- Language level: 21

**Code Style → Java → Imports**

- Import layout: Custom (arrange imports properly)

---

## Java 21 Compiler Flags

### For Enhanced Performance

```bash
java -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -XX:+ParallelRefProcEnabled \
     -XX:+UnlockExperimentalVMOptions \
     -XX:G1NewCollectionPercentage=30 \
     -XX:G1MaxNewGenPercent=40 \
     -Djava.security.egd=file:/dev/./urandom \
     -jar bulldog-api-1.0.0.jar
```

---

## Advanced Java 21 Features

### Virtual Threads Example

```java
@Configuration
public class AsyncConfig {

    @Bean
    public Executor taskExecutor() {
        // Java 21 Virtual Threads
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}
```

### Pattern Matching with Records

```java
public record TransactionQuery(
    Optional<TransactionType> type,
    Optional<String> category,
    Optional<LocalDate> startDate
) {}

public List<TransactionDTO> searchTransactions(TransactionQuery query) {
    return transactionRepository.findAll().stream()
        .filter(t -> query.type().isEmpty() || t.getType() == query.type().get())
        .filter(t -> query.category().isEmpty() || t.getCategory().equals(query.category().get()))
        .filter(t -> query.startDate().isEmpty() || t.getTransactionDate().isAfter(query.startDate().get()))
        .map(transactionMapper::toDTO)
        .toList();  // New toList() method (immutable)
}
```

---

## Summary

| Aspect            | Details                            |
| ----------------- | ---------------------------------- |
| **Java Version**  | 21 LTS                             |
| **Spring Boot**   | 3.2.0+                             |
| **Build Tool**    | Maven 3.8+                         |
| **Target**        | Hexagonal Architecture             |
| **Database**      | MySQL 8.0                          |
| **Caching**       | Redis 7+                           |
| **Testing**       | JUnit 5 + Mockito + TestContainers |
| **Documentation** | SpringDoc OpenAPI 3.0              |
| **Monitoring**    | Micrometer + Prometheus            |

This configuration is production-ready and leverages modern Java 21 features! 🚀
