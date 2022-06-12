import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "date-fns";

import { AuthContext } from "../../context/AuthContext";

import "./timerShowSummary.scss";

const TimerShowSummary = ({ newTask, setWeeklyTasks }) => {
  const { user } = useContext(AuthContext);
  const [todaySumTime, setTodaySumTime] = useState(0);
  const [weekSumTime, setWeekSumTime] = useState(0);
  const tasks = [];
  let tmpTodaySumTime = 0,
    tmpWeekSumTime = 0;

  const loadTasks = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayDay = format(new Date(), "c");
    const todayMonth = format(new Date(), "yyyy-MM");

    const res = await axios.get(`/tasks/user/${user._id}`);
    if (res.status === 200) {
      // show task
      res.data.map((val) => {
        const taskDate = format(new Date(val.startTime), "yyyy-MM-dd");
        if (taskDate.indexOf(todayMonth) === 0) {
          const checkBeforeDate = today.slice(8) - taskDate.slice(8);
          const checkAfterDate = taskDate.slice(8) - today.slice(8);
          if (checkBeforeDate >= 0 && checkBeforeDate < todayDay) {
            if (checkBeforeDate === 0) {
              tmpTodaySumTime += val.taskDuration;
            }
            tasks.splice(checkBeforeDate, 0, {
              date: checkAfterDate,
              val,
            });
            tmpWeekSumTime += val.taskDuration;
          } else if (checkAfterDate > 0 && checkAfterDate < 8 - todayDay) {
            tasks.splice(checkAfterDate, 0, {
              date: checkAfterDate,
              val,
            });
            tmpWeekSumTime += val.taskDuration;
          }
        }
      });
    }
    setWeeklyTasks(tasks);
    setTodaySumTime(tmpTodaySumTime);
    setWeekSumTime(tmpWeekSumTime);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <div className='showSummaryContainer'>
        <div className='showTodayTitle'>TODAY</div>
        <div className='showTodayTime'>
          {`${("00" + Math.floor(todaySumTime / 60 / 60)).slice(-2)}:${(
            "00" +
            (Math.floor(todaySumTime / 60) % 60)
          ).slice(-2)}:${("00" + (todaySumTime % 60)).slice(-2)}`}
        </div>
        <hr className='timerShowSummaryHr' />
        <div className='showThisWeekTitle'>THIS WEEK</div>
        <div className='showThisWeekTime'>
          {`${("00" + Math.floor(weekSumTime / 60 / 60)).slice(-2)}:${(
            "00" +
            (Math.floor(weekSumTime / 60) % 60)
          ).slice(-2)}:${("00" + (weekSumTime % 60)).slice(-2)}`}
        </div>
      </div>
    </>
  );
};

export default TimerShowSummary;
