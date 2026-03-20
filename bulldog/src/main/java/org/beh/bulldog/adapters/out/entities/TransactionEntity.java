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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "transactions", schema = "bulldog")
public class TransactionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity userEntity;

  @Column(name = "transaction_type", columnDefinition = "transaction_type not null")
  private Object transactionType;

  @NotNull
  @Column(name = "amount", nullable = false, precision = 15, scale = 2)
  private BigDecimal amount;

  @Size(max = 100)
  @Column(name = "category", length = 100)
  private String category;

  @Size(max = 255)
  @Column(name = "description")
  private String description;

  @Size(max = 100)
  @Column(name = "reference_number", length = 100)
  private String referenceNumber;

  @NotNull
  @Column(name = "transaction_date", nullable = false)
  private LocalDate transactionDate;

  @Column(name = "transaction_time")
  private LocalTime transactionTime;

  @ColumnDefault("'COMPLETED'")
  @Column(name = "status", columnDefinition = "transaction_status")
  private Object status;

  @Size(max = 500)
  @Column(name = "notes", length = 500)
  private String notes;

  @ColumnDefault("CURRENT_TIMESTAMP")
  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @ColumnDefault("CURRENT_TIMESTAMP")
  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

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

  public Object getTransactionType() {
    return transactionType;
  }

  public void setTransactionType(Object transactionType) {
    this.transactionType = transactionType;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getReferenceNumber() {
    return referenceNumber;
  }

  public void setReferenceNumber(String referenceNumber) {
    this.referenceNumber = referenceNumber;
  }

  public LocalDate getTransactionDate() {
    return transactionDate;
  }

  public void setTransactionDate(LocalDate transactionDate) {
    this.transactionDate = transactionDate;
  }

  public LocalTime getTransactionTime() {
    return transactionTime;
  }

  public void setTransactionTime(LocalTime transactionTime) {
    this.transactionTime = transactionTime;
  }

  public Object getStatus() {
    return status;
  }

  public void setStatus(Object status) {
    this.status = status;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(OffsetDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

}