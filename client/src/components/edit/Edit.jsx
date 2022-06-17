import { useContext, useState, useEffect, useRef } from "react";
import { format, formatDistanceStrict } from "date-fns";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";
import { ProjectsContext } from "../../context/ProjectsContext";

import "./edit.scss";
import { GoPrimitiveDot } from "react-icons/go";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const INITIAL_COLORCODE = "transparent";
const INITIAL_PROJECTNAME = "----";
const INITIAL_PROJECT = {
  id: "none",
  colorCode: INITIAL_COLORCODE,
  title: INITIAL_PROJECTNAME,
};
const Edit = ({ handleEditTaskWindow, mode, checkBoxData, removeCheck }) => {
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectsContext);
  const [projectName, setProjectName] = useState("");
  const [projectsList] = useState([INITIAL_PROJECT, ...projects]);
  const [selectOption, setSelectOption] = useState(false);
  const [timeInputErr, setTimeInputErr] = useState(false);
  const [timeInputErrMsg, setTimeInputErrMsg] = useState("");
  const [submitErrFlg, setSubmitErrFlg] = useState(false);
  if (mode === "new") {
    checkBoxData = [
      {
        date: 0,
        val: {
          _id: "",
          userId: "",
          title: "",
          startTime: new Date(),
          finishTime: new Date(new Date().getTime() + 1000),
          taskDuration: 0,
          projectColorCode: "",
          projectId: "",
          projectTitle: "",
        },
      },
    ];
  }

  const startTimeDate = format(
    new Date(checkBoxData[0].val.startTime),
    "yyyy-MM-dd"
  );
  const startTime =
    startTimeDate +
    "T" +
    new Date(checkBoxData[0].val.startTime).toString().slice(16, 24);
  const finishTimeDate = format(
    new Date(checkBoxData[0].val.finishTime),
    "yyyy-MM-dd"
  );
  const finishTime =
    finishTimeDate +
    "T" +
    new Date(checkBoxData[0].val.finishTime).toString().slice(16, 24);
  const minTime = useRef(startTime);
  const maxTime = useRef(finishTime);

  useEffect(() => {
    if (checkBoxData[0].val.projectId) {
      projectsList?.forEach((project) => {
        if (project._id === checkBoxData[0].val.projectId) {
          return setProjectName({
            id: project._id,
            colorCode: project.colorCode,
            title: project.title,
          });
        }
      });
    } else setProjectName("");
  }, []);

  const optionOpen = () => {
    setSelectOption((prev) => !prev);
  };

  const handleOption = (project) => {
    if (project.id !== "none") {
      setProjectName({
        id: project._id,
        colorCode: project.colorCode,
        title: project.title,
      });
    } else {
      setProjectName("");
    }
  };

  const checkTimeValidation = (e) => {
    if (e.target.id === "start-time") {
      setTimeInputErr(e.target.value >= maxTime.current.value);
      setTimeInputErrMsg("Start time should be set to a time before Stop time");
    } else {
      setTimeInputErr(e.target.value <= minTime.current.value);
      setTimeInputErrMsg("Start time should be set to a time before Stop time");
    }
  };

  const submitTask = async (e) => {
    e.preventDefault();
    if (timeInputErr) {
      return setSubmitErrFlg(true);
    } else setSubmitErrFlg(false);

    const duration = formatDistanceStrict(
      new Date(e.target[5].value),
      new Date(e.target[4].value),
      { unit: "second" }
    ).split(" ");

    if (mode === "new") {
      try {
        await axios.post("/tasks", {
          userId: user._id,
          title: e.target[1].value || "no name",
          startTime: new Date(e.target[4].value),
          finishTime: new Date(e.target[5].value),
          taskDuration: duration[0],
          projectId: e.target[2].value,
        });
      } catch (err) {
        console.log("err:", err);
      }
      handleEditTaskWindow();
    } else {
      try {
        for (let i = 0; i < checkBoxData.length; i++) {
          await axios.put(`/tasks/${checkBoxData[i].val._id}`, {
            title: e.target[1].value || "no name",
            startTime: new Date(e.target[4].value),
            finishTime: new Date(e.target[5].value),
            taskDuration: duration[0],
            projectId: e.target[2].value,
          });
        }
      } catch (err) {
        console.log("err:", err);
      }
      removeCheck();
    }
  };

  return (
    <>
      <div
        className='editTaskContainerBack'
        onClick={handleEditTaskWindow}
      ></div>
      <div className='editTaskContainer'>
        <span className='editTaskContainerTitle'>
          {mode === "new"
            ? "Create New Task"
            : checkBoxData.length > 1
            ? `Edit ${checkBoxData.length} Tasks`
            : "Edit Task"}
        </span>

        <form onSubmit={submitTask} autoComplete='off' className='editTaskForm'>
          <input
            type='hidden'
            name='task-id'
            defaultValue={checkBoxData[0].val._id}
          />
          <div className='editTaskFormContainer'>
            <div className='editTaskFormInputSetContainer'>
              <label
                htmlFor='project-List'
                className='editTaskFormLabel'
              ></label>
              <input
                type='text'
                id='project-List'
                name='project-List'
                placeholder='Enter Task Name'
                defaultValue={
                  checkBoxData.length > 1 ? "" : checkBoxData[0].val.title
                }
                className='editTaskFormInput'
              />

              <input
                type='hidden'
                name='project-id'
                defaultValue={projectName.id}
              />
              <label htmlFor='project' className='editTaskFormLabel'></label>
              <select id='project' name='project' value={projectName.id}>
                {projectsList.map((project, idx) => (
                  <option key={idx} value={project.title}></option>
                ))}
              </select>
              <div className='editTaskFormSelect' onClick={optionOpen}>
                <div className='editTaskFormSelectOption'>
                  <GoPrimitiveDot
                    style={{
                      fill: `${projectName.colorCode || INITIAL_COLORCODE}`,
                    }}
                  />
                  {projectName.title || INITIAL_PROJECTNAME}
                </div>
                {selectOption ? <BiChevronUp /> : <BiChevronDown />}
                {selectOption && (
                  <>
                    <div className='editTaskFormSelectOptionListBack'></div>
                    <div className='editTaskFormSelectOptionList'>
                      {projectsList.map((project, idx) => (
                        <div
                          key={idx}
                          className='optionListContainer'
                          onClick={() => handleOption(project)}
                        >
                          <GoPrimitiveDot
                            style={{ fill: `${project.colorCode}` }}
                          />
                          {project.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className='editTaskFormTimeContainer'>
                <div className='editTaskFormTimeSet'>
                  <label
                    htmlFor='start-time'
                    className={`editTaskFormLabel ${
                      timeInputErr ? "timeLabelErr" : ""
                    }`}
                  >
                    Start Time
                  </label>
                  <div
                    className={`editTaskFormTime ${
                      timeInputErr ? "timeInputErr" : ""
                    }`}
                  >
                    <input
                      type='datetime-local'
                      id='start-time'
                      name='start-time'
                      ref={minTime}
                      defaultValue={startTime}
                      className='editTaskFormTimeInput'
                      step='1'
                      onBlur={checkTimeValidation}
                    />
                  </div>
                </div>

                <div className='editTaskFormTimeSet'>
                  <label
                    htmlFor='finish-time'
                    className={`editTaskFormLabel ${
                      timeInputErr ? "timeLabelErr" : ""
                    }`}
                  >
                    Stop Time
                  </label>
                  <div
                    className={`editTaskFormTime ${
                      timeInputErr ? "timeInputErr" : ""
                    }`}
                  >
                    <input
                      type='datetime-local'
                      id='finish-time'
                      name='finish-time'
                      ref={maxTime}
                      defaultValue={finishTime}
                      className='editTaskFormTimeInput'
                      step='1'
                      onBlur={checkTimeValidation}
                    />
                  </div>
                </div>
              </div>
              {timeInputErr && (
                <div className='timeInputErrMsg'>{timeInputErrMsg}</div>
              )}
            </div>
          </div>
          <button className='editTaskFormBtn' type='submit'>
            Submit
          </button>
        </form>
        {submitErrFlg && (
          <div className='timeInputErrMsg'>Please clear error</div>
        )}
      </div>
    </>
  );
};

export default Edit;
