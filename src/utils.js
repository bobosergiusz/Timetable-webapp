const daysOfTheWeekFromDate = (date) => {
  const base = date.clone().startOf("isoWeek");
  const returnValue = [base];
  for (let i = 1; i <= 6; i++) {
    returnValue.push(base.clone().add(i, "day"));
  }
  return returnValue;
};

export { daysOfTheWeekFromDate };
