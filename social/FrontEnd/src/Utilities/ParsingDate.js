import dateParser from "date-parse";
const parseDateF = (date) => {
  let birth_date_temp = dateParser(date);
  birth_date_temp =
    birth_date_temp.getFullYear() +
    "-" +
    (birth_date_temp.getMonth() + 1) +
    "-" +
    birth_date_temp.getDate();
  return birth_date_temp;
};

export default parseDateF;
