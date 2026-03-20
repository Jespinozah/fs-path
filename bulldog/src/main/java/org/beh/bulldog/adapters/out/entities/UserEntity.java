package org.beh.bulldog.adapters.out.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "users", schema = "bulldog")
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long id;

  @Size(max = 100)
  @NotNull
  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Size(max = 100)
  @NotNull
  @Column(name = "email", nullable = false, length = 100)
  private String email;

  @Column(name = "age")
  private Integer age;

  @Size(max = 255)
  @NotNull
  @Column(name = "password", nullable = false)
  private String password;

  @ColumnDefault("true")
  @Column(name = "is_active")
  private Boolean isActive;

  @ColumnDefault("CURRENT_TIMESTAMP")
  @Column(name = "created_at")
  private OffsetDateTime createdAt;

  @ColumnDefault("CURRENT_TIMESTAMP")
  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @OneToMany(mappedBy = "userEntity")
  private Set<AuditLogEntity> auditLogEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<BankAccountEntity> bankAccountEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<ExpenseCategoryEntity> expenseCategories = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<IncomeCategoryEntity> incomeCategories = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<RefreshTokenEntity> refreshTokenEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<TransactionEntity> transactionEntities = new LinkedHashSet<>();

  @OneToMany(mappedBy = "userEntity")
  private Set<TransferEntity> transferEntities = new LinkedHashSet<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = isActive;
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

  public Set<AuditLogEntity> getAuditLogs() {
    return auditLogEntities;
  }

  public void setAuditLogs(Set<AuditLogEntity> auditLogEntities) {
    this.auditLogEntities = auditLogEntities;
  }

  public Set<BankAccountEntity> getBankAccounts() {
    return bankAccountEntities;
  }

  public void setBankAccounts(Set<BankAccountEntity> bankAccountEntities) {
    this.bankAccountEntities = bankAccountEntities;
  }

  public Set<ExpenseCategoryEntity> getExpenseCategories() {
    return expenseCategories;
  }

  public void setExpenseCategories(Set<ExpenseCategoryEntity> expenseCategories) {
    this.expenseCategories = expenseCategories;
  }

  public Set<IncomeCategoryEntity> getIncomeCategories() {
    return incomeCategories;
  }

  public void setIncomeCategories(Set<IncomeCategoryEntity> incomeCategories) {
    this.incomeCategories = incomeCategories;
  }

  public Set<RefreshTokenEntity> getRefreshTokens() {
    return refreshTokenEntities;
  }

  public void setRefreshTokens(Set<RefreshTokenEntity> refreshTokenEntities) {
    this.refreshTokenEntities = refreshTokenEntities;
  }

  public Set<TransactionEntity> getTransactions() {
    return transactionEntities;
  }

  public void setTransactions(Set<TransactionEntity> transactionEntities) {
    this.transactionEntities = transactionEntities;
  }

  public Set<TransferEntity> getTransfers() {
    return transferEntities;
  }

  public void setTransfers(Set<TransferEntity> transferEntities) {
    this.transferEntities = transferEntities;
  }

}