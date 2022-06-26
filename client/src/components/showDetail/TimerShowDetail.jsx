import { useState, useEffect } from "react";
import axios from "axios";

import TimerShowDetailCard from "../showDetailCard/TimerShowDetailCard";
import Edit from "../../components/edit/Edit";
import { format } from "date-fns";

import "./timerShowDetail.scss";
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdIndeterminateCheckBox,
} from "react-icons/md";

const TimerShowDetail = ({ data, handleEditProjectWindow, handleReload }) => {
  const [checkBoxData, setCheckBoxData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  let totalTime = 0;
  data.forEach((el) => (totalTime += el.val.taskDuration));
  data.sort((a, b) => b.val.startTime.localeCompare(a.val.startTime));
  const [showData, setShowData] = useState(data);
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(
    new Date().setDate(new Date().getDate() - 1),
    "yyyy-MM-dd"
  );
  // console.log("checkBoxData", checkBoxData);

  useEffect(() => {
    data.forEach((el) => (totalTime += el.val.taskDuration));
    data.sort((a, b) => b.val.startTime.localeCompare(a.val.startTime));
    setShowData(data);
  }, [data]);

  const allSelect = () => {
    if (checkBoxData.length > 0) setCheckBoxData([]);
    else setCheckBoxData(showData);
  };

  const addCheckBoxData = (addFlg, addData) => {
    if (addFlg === 1) {
      setCheckBoxData((prev) => {
        const tmpData = [...prev];
        tmpData.splice(0, 0, addData);
        return tmpData;
      });
    } else {
      setCheckBoxData((prev) => {
        const tmpData = [...prev];
        return tmpData.filter((el) => !(el === addData));
      });
    }
  };

  const handleEditTaskWindow = () => {
    setEditOpen((prev) => !prev);
    // if (editOpen) handleReload();
  };

  const removeCheck = () => {
    setEditOpen((prev) => !prev);
    setCheckBoxData([]);
    if (editOpen) handleReload();
  };

  const handleDelete = () => {
    checkBoxData.forEach(async (removeEl) => {
      // delete
      try {
        await axios.delete(`/tasks/${removeEl.val._id}`);
      } catch (err) {
        console.log("err:", err);
      }
    });
    const clearCheckBoxInterval = setInterval(() => {
      setCheckBoxData([]);
      clearInterval(clearCheckBoxInterval);
    }, 500);
    const reloadInterval = setInterval(() => {
      handleReload();
      clearInterval(reloadInterval);
    }, 800);
  };

  return (
    <>
      <div className='detailsDateContainer'>
        <div className='detailsDateContainerTitle'>
          <div className='detailsDateEditContainer'>
            <div className='detailsDateEditCheckbox' onClick={allSelect}>
              {checkBoxData.length === showData.length ? (
                <MdCheckBox />
              ) : checkBoxData.length !== 0 ? (
                <MdIndeterminateCheckBox />
              ) : (
                <MdCheckBoxOutlineBlank />
              )}
            </div>
            <div className='detailDate'>
              {format(new Date(data[0].val.startTime), "yyyy-MM-dd") === today
                ? "Today"
                : format(new Date(data[0].val.startTime), "yyyy-MM-dd") ===
                  yesterday
                ? "Yesterday"
                : format(new Date(data[0].val.startTime), "yyyy-MM-dd")}
            </div>
            <span className='detailDateSelect'>
              {checkBoxData.length} / {showData.length} items selected
            </span>
            <button
              className='detailDateEdit'
              disabled={checkBoxData.length === 0}
              onClick={handleEditTaskWindow}
            >
              Edit
            </button>
            <button
              className='detailDateDelete'
              disabled={checkBoxData.length === 0}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          <div className='detailTimeSum'>
            {`${("00" + Math.floor(totalTime / 60 / 60)).slice(-2)}:${(
              "00" +
              (Math.floor(totalTime / 60) % 60)
            ).slice(-2)}:${("00" + (totalTime % 60)).slice(-2)}`}
          </div>
        </div>
        <div className='detailsTasksContainer'>
          {showData.map((el, idx) => (
            <TimerShowDetailCard
              key={idx}
              el={el}
              checkBoxData={checkBoxData}
              dataLength={showData.length}
              addCheckBoxData={addCheckBoxData}
              handleEditProjectWindow={handleEditProjectWindow}
            />
          ))}
        </div>
      </div>
      {editOpen && (
        <Edit
          handleEditTaskWindow={handleEditTaskWindow}
          checkBoxData={checkBoxData}
          removeCheck={removeCheck}
        />
      )}
    </>
  );
};

export default TimerShowDetail;
