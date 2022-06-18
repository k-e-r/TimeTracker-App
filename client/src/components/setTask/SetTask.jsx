import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";
import "./setTask.scss";

import { BsTagFill, BsPlayCircle, BsPlusSquareDotted } from "react-icons/bs";
import { AiTwotoneSetting } from "react-icons/ai";
import { FaStopCircle } from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";
import { BiCoffee } from "react-icons/bi";

import Projects from "../projects/Projects";
import Edit from "../edit/Edit";
import Alarm from "../alarm/Alarm";
import Setting from "../setting/Setting";
import { Helmet } from "react-helmet";

let timerId;
const SetTask = ({ setTask, handleEditProjectWindow, handleReload }) => {
  const { user } = useContext(AuthContext);
  const [titleText, setTitleText] = useState("TimeTracker");

  const timeMinutes = Math.floor(user.duration / 60);
  const timeSeconds = Math.floor(user.duration % 60);
  const shortBreakTimeMinutes = Math.floor(user.shortBreak / 60);
  const shortBreakTimeSeconds = Math.floor(user.shortBreak % 60);
  const longBreakTimeMinutes = Math.floor(user.longBreak / 60);
  const longBreakTimeSeconds = Math.floor(user.longBreak % 60);
  const pomodoroCycleRst = user.longBreakInterval;

  const [startTimer, setStartTimer] = useState(true);
  const [pomodoroCycle, setPomodoroCycle] = useState(0);
  // this value is pomodoro from settings
  const [settingTimerMin, setSettingTimerMin] = useState(
    user.timerMode === "pomodoro" ? timeMinutes : 0
  );
  const [settingTimerSec, setSettingTimerSec] = useState(
    user.timerMode === "pomodoro" ? timeSeconds : 0
  );
  const [endTime, setEndTime] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const taskName = useRef();

  useEffect(() => {
    if (user.timerMode === "pomodoro") {
      if (pomodoroCycle % 2) {
        if (pomodoroCycle === pomodoroCycleRst * 2 - 1) {
          timerInit("longBreak");
        } else timerInit("shortBreak");
      } else timerInit("pomodoro");
    } else {
      timerInit();
    }
  }, [user]);

  const timerInit = (mode = "") => {
    if (mode === "shortBreak") {
      // break time
      setSettingTimerMin(shortBreakTimeMinutes);
      setSettingTimerSec(shortBreakTimeSeconds);
    } else if (mode === "longBreak") {
      // long break time
      setSettingTimerMin(longBreakTimeMinutes);
      setSettingTimerSec(longBreakTimeSeconds);
    } else if (mode === "pomodoro") {
      // initial time
      setSettingTimerMin(timeMinutes);
      setSettingTimerSec(timeSeconds);
    } else {
      setSettingTimerMin(0);
      setSettingTimerSec(0);
    }
  };

  let timeMinutes2 = timeMinutes;
  let timeSeconds2 = timeSeconds;
  const setTime = () => {
    setSettingTimerMin(timeMinutes2);
    setSettingTimerSec(timeSeconds2);
    console.log(timeMinutes2, ":", timeSeconds2);
    console.log(Math.round(new Date().getTime() / 1000));
  };

  let startTime, pastTime;
  const countDown = () => {
    if (timerId === undefined) {
      startTime = Math.round(new Date().getTime() / 1000);
      timerId = setInterval(() => {
        pastTime = Math.round(new Date().getTime() / 1000) - startTime;
        const setTimeData = user.duration - pastTime;
        console.log("pastTime", pastTime, "setTimeData", setTimeData);
        if (setTimeData < 0) {
          timeMinutes2 = 0;
          timeSeconds2 = 0;
        } else {
          timeMinutes2 = Math.floor(setTimeData / 60);
          timeSeconds2 = Math.floor(setTimeData % 60);
        }
        setTime();
      }, 100);
    }
  };

  const countUp = () => {
    if (timerId === undefined) {
      startTime = Math.round(new Date().getTime() / 1000);
      timerId = setInterval(() => {
        pastTime = Math.round(new Date().getTime() / 1000) - startTime;
        timeMinutes2 = Math.floor(pastTime / 60);
        timeSeconds2 = Math.floor(pastTime % 60);
        setTime();
      }, 100);
    }
  };

  useEffect(() => {
    if (user.timerMode === "pomodoro") {
      if (pomodoroCycle % 2) {
        if (pomodoroCycle === pomodoroCycleRst * 2 - 1) {
          timerInit("longBreak");
        } else timerInit("shortBreak");
      } else timerInit("pomodoro");
      if (pomodoroCycle === pomodoroCycleRst * 2) setPomodoroCycle(0);
    }
  }, [pomodoroCycle]);

  useEffect(() => {
    if (pomodoroCycle % 2) {
      setPomodoroCycle((prev) => prev + 1);
    } else {
      const taskSubmit = async () => {
        if (endTime) {
          // let duration, calcEndTime;
          // if (user.timerMode === "pomodoro" && alarmOpen) {
          //   duration = user.duration;
          //   calcEndTime = beginTime + duration * 1000;
          // } else if (user.timerMode === "pomodoro" && !alarmOpen) {
          //   duration = user.duration - (settingTimerMin * 60 + settingTimerSec);
          //   calcEndTime = beginTime + duration * 1000;
          // } else if (user.timerMode !== "pomodoro") {
          //   duration = settingTimerMin * 60 + settingTimerSec;
          //   calcEndTime = beginTime + duration * 1000;
          // }
          const duration = Math.floor((endTime - beginTime) / 1000);
          const res = await axios.post("/tasks", {
            userId: user._id,
            title: taskName.current.value || "no name",
            startTime: beginTime,
            finishTime: endTime,
            taskDuration: duration,
            projectId: projectName._id,
            projectTitle: projectName.title,
            projectColorCode: projectName.colorCode,
          });
          if (res.status === 200) {
            setTask(res.data);
          }
          taskName.current.value = "";
          setProjectName("");
          setEndTime("");
          if (user.timerMode === "pomodoro")
            setPomodoroCycle((prev) => prev + 1);
          else {
            timerInit();
          }
        }
      };
      taskSubmit();
    }
  }, [endTime]);

  useEffect(() => {
    if (!startTimer) {
      if (user.timerMode === "pomodoro") {
        if (settingTimerSec === 0 && settingTimerMin === 0) {
          clearInterval(timerId);
          // timerInit();
          // api call
          setAlarmOpen(true);
          setStartTimer(true); // stop
          setEndTime(new Date().getTime());
        } else {
          countDown();
        }
      } else {
        countUp();
        setPomodoroCycle(0);
      }
    }
  }, [startTimer, settingTimerSec]);

  const setProject = (project) => {
    setProjectName(project);
  };

  const handleModal = () => {
    setProjectsOpen((prev) => !prev);
  };

  const handleTimer = () => {
    if (startTimer) {
      setBeginTime(new Date().getTime());
    } else {
      clearInterval(timerId);
      // timerInit();
      // api call
      setEndTime(new Date().getTime());
    }
    setStartTimer((prev) => !prev);
  };

  const handleEditTaskWindow = () => {
    setEditOpen((prev) => !prev);
    if (editOpen) handleReload();
  };

  const handleAlarmWindow = () => {
    setAlarmOpen((prev) => !prev);
  };

  const handleSettingWindow = () => {
    setSettingOpen((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>{titleText}</title>
        <meta name='description' content='Helmet application' />
      </Helmet>
      <div className='timerSetContainer'>
        <div className='timerSetTask'>
          {pomodoroCycle === 7 ? (
            <div className='timerSetTaskBreakMsg'>
              <span>Long Break Time...</span>
              <BiCoffee />
            </div>
          ) : pomodoroCycle % 2 ? (
            <div className='timerSetTaskBreakMsg'>
              <span>Short Break Time...</span>
              <BiCoffee />
            </div>
          ) : (
            <input
              type='text'
              className='timerSetTaskInput'
              placeholder='Please enter task name'
              ref={taskName}
            />
          )}
        </div>
        {projectName && (
          <div
            className='timerSetProjectTag timerSetTag'
            onClick={() => setProjectsOpen((prev) => !prev)}
          >
            <span
              className='timerSetProjectTagBack'
              style={{
                backgroundColor: `${projectName.colorCode}`,
              }}
            >
              &nbsp;
            </span>
            <GoPrimitiveDot style={{ fill: `${projectName.colorCode}` }} />
            <span className='timerSetProjectTagTitle'>{projectName.title}</span>
            {projectsOpen && (
              <Projects
                handleModal={handleModal}
                setProject={setProject}
                handleEditProjectWindow={handleEditProjectWindow}
              />
            )}
          </div>
        )}
        {pomodoroCycle % 2 !== 1 && !projectName && (
          <button className='timerSetTag' onClick={() => handleModal()}>
            <BsTagFill />
            {projectsOpen && (
              <Projects
                handleModal={handleModal}
                setProject={setProject}
                handleEditProjectWindow={handleEditProjectWindow}
              />
            )}
          </button>
        )}
        <div className='timerStartContainer'>
          <div className='timerBox'>
            <span>
              {`${("00" + settingTimerMin).slice(-2)}:${(
                "00" + settingTimerSec
              ).slice(-2)}`}
            </span>
          </div>
          <button className='timerStartBtn' onClick={handleTimer}>
            {startTimer ? <BsPlayCircle /> : <FaStopCircle />}
          </button>
          <button
            className='timerAddBtn'
            disabled={!startTimer}
            onClick={handleEditTaskWindow}
          >
            <BsPlusSquareDotted />
          </button>
        </div>
        <button
          className='timerSetting'
          disabled={!startTimer}
          onClick={handleSettingWindow}
        >
          <AiTwotoneSetting />
        </button>

        {editOpen && (
          <Edit handleEditTaskWindow={handleEditTaskWindow} mode='new' />
        )}
        {alarmOpen && (
          <Alarm
            handleAlarmWindow={handleAlarmWindow}
            pomodoroCycle={pomodoroCycle}
          />
        )}
        {settingOpen && <Setting handleSettingWindow={handleSettingWindow} />}
      </div>
    </>
  );
};

export default SetTask;
