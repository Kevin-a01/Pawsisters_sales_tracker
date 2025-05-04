import React, { useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);

export default function Calender() {

  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.startOf("week");
  const endDay = endOfMonth.endOf("week");

  const days = [];

  let day = startDay

  while (day.isBefore(endDay, "day")){
    days.push(day);
    day = day.add(1, "day");

  }

  return(
    <div>
      Hej
    </div>

  )

} 