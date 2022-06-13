import { useState } from "react";
import Projects from "../projects/Projects";
import axios from "axios";

import "./timerShowDetailCard.scss";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { GoPrimitiveDot } from "react-icons/go";
import { BsTagFill } from "react-icons/bs";
import { useEffect } from "react";
import AddProject from "../addProject/AddProject";

const TimerShowDetailCard = ({
  el,
  checkBoxData,
  dataLength,
  addCheckBoxData,
}) => {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [addProjectWindow, setAddProjectWindow] = useState(false);

  useEffect(() => {
    if (el.val.projectTitle) {
      setProjectName({
        colorCode: el.val.projectColorCode,
        title: el.val.projectTitle,
      });
    }
  }, [el]);

  useEffect(() => {
    if (checkBoxData.length === dataLength) setCheckBox(true);
    else if (checkBoxData.length === 0) setCheckBox(false);
  }, [checkBoxData]);

  const setProject = (project) => {
    setProjectName(project);
    const task = el.val;
    task.projectId = project._id || "";
    task.projectTitle = project.title || "";
    task.projectColorCode = project.colorCode || "";
    const taskSubmit = async () => {
      const res = await axios.put(`/tasks/${task._id}`, task);
      if (res.status === 200) {
        console.log(res.data);
      }
    };
    taskSubmit();
  };

  const handleModal = () => {
    setProjectsOpen((prev) => !prev);
  };

  const handleCheckBox = () => {
    if (!checkBox) {
      addCheckBoxData(1, el);
      setCheckBox(true);
    } else {
      addCheckBoxData(-1, el);
      setCheckBox(false);
    }
  };

  const handleAddProjectWindow = () => {
    console.log("handleAddProjectWindow");
    setAddProjectWindow((prev) => !prev);
  };

  return (
    <div className='detailsDateContainerTask'>
      <div className='detailsTaskDateEditContainer'>
        <div className='detailsDateCardEditCheckbox' onClick={handleCheckBox}>
          {checkBox ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        </div>
        <div className='detailTask' onClick={handleCheckBox}>
          {el.val.title}
        </div>
        {projectName && (
          <div
            className='detailsDateProjectTag'
            onClick={() => setProjectsOpen((prev) => !prev)}
          >
            <span
              className='detailsDateProjectTagBack'
              style={{
                backgroundColor: `${projectName.colorCode}`,
              }}
            >
              &nbsp;
            </span>
            <GoPrimitiveDot style={{ fill: `${projectName.colorCode}` }} />
            {projectName.title}
            {projectsOpen && (
              <Projects
                handleModal={handleModal}
                setProject={setProject}
                handleAddProjectWindow={handleAddProjectWindow}
              />
            )}
          </div>
        )}
        {!projectName && (
          <div className='detailTaskTag'>
            <button className='detailTaskTagBtn' onClick={() => handleModal()}>
              <BsTagFill />
              {projectsOpen && (
                <Projects
                  handleModal={handleModal}
                  setProject={setProject}
                  handleAddProjectWindow={handleAddProjectWindow}
                />
              )}
            </button>
          </div>
        )}
      </div>
      <div className='detailTaskTimeSum'>
        {`${("00" + Math.floor(el.val.taskDuration / 60 / 60)).slice(-2)}:${(
          "00" +
          (Math.floor(el.val.taskDuration / 60) % 60)
        ).slice(-2)}:${("00" + (el.val.taskDuration % 60)).slice(-2)}`}
      </div>
      {addProjectWindow && (
        <AddProject handleAddProjectWindow={handleAddProjectWindow} />
      )}
    </div>
  );
};

export default TimerShowDetailCard;
