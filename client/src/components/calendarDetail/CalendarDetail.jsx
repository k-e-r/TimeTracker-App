import "./calendarDetail.scss";

const WEEK_NAME = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_NAME = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CalendarDetail = ({ calendarDate, showTask }) => {
  const totalTime = showTask.map((el) => {
    let sumTime = 0;
    el.map((task) => {
      return (sumTime += task.val.taskDuration);
    });
    return sumTime;
  });
  if (totalTime.length === 0) {
    [...Array(7)].map((x) => totalTime.push(0));
  }

  return (
    <div className='calendarContainerTitle'>
      <div className='calendarContainerTitleController'>
        <span className='calendarMonthName'>
          {MONTH_NAME[parseInt(calendarDate[0].slice(5, 7)) - 1]}
        </span>
      </div>
      {calendarDate.map((date, idx) => (
        <div className='calendarContainerTitleSet' key={idx}>
          <span className='calendarTitleDate'>{date.slice(8)}</span>
          <div className='calendarTitleDetailBox'>
            <span className='calendarTitleDay'>{WEEK_NAME[idx]}</span>
            <span className='calendarTitleSumTime'>
              {`${("00" + Math.floor(totalTime[idx] / 60 / 60)).slice(-2)}:${(
                "00" +
                (Math.floor(totalTime[idx] / 60) % 60)
              ).slice(-2)}:${("00" + (totalTime[idx] % 60)).slice(-2)}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarDetail;
