import { useContext } from "react";
import { format } from "date-fns";

import CalendarDetail from "../calendarDetail/CalendarDetail";
import { ProjectsContext } from "../../context/ProjectsContext";

import "./calendar.scss";

const SEPARATION = 24;
const Calendar = ({ calendarDate, tasks }) => {
  const { projects } = useContext(ProjectsContext);
  const showTask = tasks.map((x, idx, tasks) => tasks[tasks.length - 1 - idx]);
  const resultArr = [];

  showTask.map((showDate) => {
    const tmpResultArr = [];
    showDate.map((task) =>
      [...Array(SEPARATION)].map((x, dateIdx) => {
        const startTime = new Date(task.val.startTime);
        if (
          startTime.toString().slice(16, 18) ===
          ("00" + Math.floor(dateIdx)).slice(-2)
        ) {
          if (task.val.projectId) {
            projects?.forEach((project) => {
              if (project._id === task.val.projectId) {
                tmpResultArr.push({
                  idx: parseInt(startTime.toString().slice(16, 18)),
                  task: {
                    ...task.val,
                    projectColorCode: project.colorCode,
                    projectTitle: project.title,
                  },
                });
              }
            });
          } else {
            tmpResultArr.push({
              idx: parseInt(startTime.toString().slice(16, 18)),
              task: task.val,
            });
          }
        }
      })
    );
    resultArr.push(tmpResultArr);
  });

  return (
    <div className='calendarContainer'>
      <CalendarDetail calendarDate={calendarDate} showTask={showTask} />
      <div className='calendarContainerTimePilar'>
        <div className='calendarContainerTimeControler'>
          {[...Array(SEPARATION)].map((num, idx) => (
            <div className='calendarTimeDateBox' key={idx}>
              <span className='calendarTime'>
                {`${("00" + Math.floor(idx + 1)).slice(-2)}:${"00".slice(-2)}`}
              </span>
            </div>
          ))}
        </div>
        {[...Array(7)].map((date, dateIdx) => (
          <div className='calendarContainerTimeSet' key={dateIdx}>
            {[...Array(SEPARATION)].map((num, idx) => (
              <div className='calendarTimeDateBox' key={idx}>
                {resultArr[dateIdx]?.map(
                  (task, taskIdx) =>
                    task.idx === idx && (
                      <div className='calendarTimeTaskContainer' key={taskIdx}>
                        <span
                          className='detailsDateProjectTagBack'
                          style={{
                            backgroundColor: `${task.task.projectColorCode}`,
                          }}
                        >
                          &nbsp;
                        </span>
                        <span className='calendarTimeTaskTitle'>
                          {task.task.title}
                        </span>
                      </div>
                    )
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
