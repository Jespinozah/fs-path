package org.beh.bulldog.adapters.out.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.Map;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "audit_logs", schema = "bulldog")
public class AuditLogEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  @JoinColumn(name = "user_id")
  private UserEntity userEntity;

  @Size(max = 50)
  @NotNull
  @Column(name = "action", nullable = false, length = 50)
  private String action;

  @Size(max = 50)
  @NotNull
  @Column(name = "entity_type", nullable = false, length = 50)
  private String entityType;

  @Column(name = "entity_id")
  private Long entityId;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "old_values")
  private Map<String, Object> oldValues;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "new_values")
  private Map<String, Object> newValues;

  @Size(max = 45)
  @Column(name = "ip_address", length = 45)
  private String ipAddress;

  @ColumnDefault("CURRENT_TIMESTAMP")
  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UserEntity getUser() {
    return userEntity;
  }

  public void setUser(UserEntity userEntity) {
    this.userEntity = userEntity;
  }

  public String getAction() {
    return action;
  }

  public void setAction(String action) {
    this.action = action;
  }

  public String getEntityType() {
    return entityType;
  }

  public void setEntityType(String entityType) {
    this.entityType = entityType;
  }

  public Long getEntityId() {
    return entityId;
  }

  public void setEntityId(Long entityId) {
    this.entityId = entityId;
  }

  public Map<String, Object> getOldValues() {
    return oldValues;
  }

  public void setOldValues(Map<String, Object> oldValues) {
    this.oldValues = oldValues;
  }

  public Map<String, Object> getNewValues() {
    return newValues;
  }

  public void setNewValues(Map<String, Object> newValues) {
    this.newValues = newValues;
  }

  public String getIpAddress() {
    return ipAddress;
  }

  public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }

}