import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  format,
  previousMonday,
  nextMonday,
  nextDay,
  parseISO,
} from "date-fns";

import { AuthContext } from "../../context/AuthContext";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";

import "./timerShowSummary.scss";
import ChangeView from "../changeView/ChangeView";

const TimerShowSummary = ({
  tasks,
  newTask,
  setWeeklyTasks,
  addWeeklyTask,
  loadFlg,
  handleView,
  changeView,
  setDate,
}) => {
  const { user } = useContext(AuthContext);
  const [viewOpen, setViewOpen] = useState(false);
  const [todaySumTime, setTodaySumTime] = useState(0);
  const [weekSumTime, setWeekSumTime] = useState(0);
  const [baseMonday, setBaseMonday] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");
  // const WEEK_ARR = [0, 2, 3, 4, 5, 6];
  const WEEK_ARR = [0, 6, 5, 4, 3, 2];
  const tmpTasks = [];
  let tmpTodaySumTime = 0,
    tmpThisWeekSumTime = 0;

  // set init Monday
  useEffect(() => {
    thisWeek();
  }, []);

  useEffect(() => {
    if (baseMonday !== "") loadTasks();
  }, [loadFlg, baseMonday]);

  useEffect(() => {
    if (newTask.length !== 0) {
      const taskDate = format(new Date(newTask.startTime), "yyyy-MM-dd");
      if (taskDate === baseMonday) {
        setWeekSumTime((prev) => prev + newTask.taskDuration);
        if (taskDate === today) {
          setTodaySumTime((prev) => prev + newTask.taskDuration);
        }
        tasks[6].unshift({
          date: 1,
          val: newTask,
        });
        addWeeklyTask(tasks);
      } else {
        WEEK_ARR.forEach((DAY, idx) => {
          if (
            taskDate ===
            format(nextDay(parseISO(baseMonday), DAY), "yyyy-MM-dd")
          ) {
            setWeekSumTime((prev) => prev + newTask.taskDuration);
            if (taskDate === today) {
              setTodaySumTime((prev) => prev + newTask.taskDuration);
            }
            tasks[idx].unshift({
              date: DAY,
              val: newTask,
            });
            addWeeklyTask(tasks);
          }
        });
      }
    }
  }, [newTask]);

  const loadTasks = async () => {
    const res = await axios.get(`/tasks/user/${user._id}`);
    if (res.status === 200) {
      res.data.map((val) => {
        const taskDate = format(new Date(val.startTime), "yyyy-MM-dd");
        if (taskDate === baseMonday) {
          tmpThisWeekSumTime += val.taskDuration;
          if (taskDate === today) {
            tmpTodaySumTime += val.taskDuration;
          }
          tmpTasks.push({
            date: 1,
            val,
          });
        } else {
          WEEK_ARR.forEach((DAY) => {
            if (
              taskDate ===
              format(nextDay(parseISO(baseMonday), DAY), "yyyy-MM-dd")
            ) {
              tmpThisWeekSumTime += val.taskDuration;
              if (taskDate === today) {
                tmpTodaySumTime += val.taskDuration;
              }
              tmpTasks.push({
                date: DAY,
                val,
              });
            }
          });
        }
      });
    }
    setDate(baseMonday);
    if (tmpTasks.length === 0) setWeeklyTasks(baseMonday);
    else setWeeklyTasks(tmpTasks);
    setTodaySumTime(tmpTodaySumTime);
    setWeekSumTime(tmpThisWeekSumTime);
  };

  const prevWeek = () => {
    setDate(format(previousMonday(parseISO(baseMonday)), "yyyy-MM-dd"));
    setBaseMonday(format(previousMonday(parseISO(baseMonday)), "yyyy-MM-dd"));
  };

  const nextWeek = () => {
    setDate(format(nextMonday(parseISO(baseMonday)), "yyyy-MM-dd"));
    setBaseMonday(format(nextMonday(parseISO(baseMonday)), "yyyy-MM-dd"));
  };

  const thisWeek = () => {
    const todayDay = format(new Date(), "c");
    if (todayDay === "2") {
      setBaseMonday(format(new Date(), "yyyy-MM-dd"));
    } else {
      setBaseMonday(format(previousMonday(new Date()), "yyyy-MM-dd"));
    }
  };

  const handleChangeViewWindow = () => {
    setViewOpen((prev) => !prev);
  };

  return (
    <div className='showSummaryContainer'>
      <div className='showLeftItem'>
        <BiChevronLeft onClick={prevWeek} />
        <span onClick={thisWeek}>Today</span>
        <BiChevronRight onClick={nextWeek} />
      </div>
      <div className='showRightItem'>
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
        <div className='showChangeView' onClick={handleChangeViewWindow}>
          VIEW{viewOpen ? <BiChevronUp /> : <BiChevronDown />}
        </div>
        {viewOpen && (
          <ChangeView
            handleChangeViewWindow={handleChangeViewWindow}
            handleView={handleView}
            changeView={changeView}
          />
        )}
      </div>
    </div>
  );
};

export default TimerShowSummary;
