const sortExpenses = (expenses) => {
  return expenses.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || "00:00:00"}`);
    const dateB = new Date(`${b.date}T${b.time || "00:00:00"}`);
    return dateB - dateA;
  });
}

export default sortExpenses;