package org.beh.bulldog.adapters.out.mappers;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.beh.bulldog.adapters.out.entities.UserEntity;
import org.beh.bulldog.domain.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserEntityMapper {

  @Mapping(target = "email", ignore = true)
  @Mapping(target = "password", ignore = true)
  @Mapping(target = "auditLogs", ignore = true)
  @Mapping(target = "bankAccounts", ignore = true)
  @Mapping(target = "expenseCategories", ignore = true)
  @Mapping(target = "incomeCategories", ignore = true)
  @Mapping(target = "refreshTokens", ignore = true)
  @Mapping(target = "transactions", ignore = true)
  @Mapping(target = "transfers", ignore = true)
  UserEntity toEntity(User user);

  @Mapping(target = "email", ignore = true)
  @Mapping(target = "password", ignore = true)
  @Mapping(target = "bankAccounts", ignore = true)
  User toDomain(UserEntity entity);

  default OffsetDateTime toOffsetDateTime(LocalDateTime localDateTime) {
    if (localDateTime == null) return null;
    return localDateTime.atOffset(ZoneOffset.UTC);
  }

  default LocalDateTime toLocalDateTime(OffsetDateTime offsetDateTime) {
    if (offsetDateTime == null) return null;
    return offsetDateTime.toLocalDateTime();
  }
}
