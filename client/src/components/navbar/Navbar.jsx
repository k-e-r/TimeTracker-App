import "./navbar.scss";
import { Link } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import { format } from "date-fns";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const headers = [
    { label: "Project", key: "project" },
    { label: "Task", key: "task" },
    { label: "Duration", key: "duration" },
    { label: "Billable duration", key: "billableDuration" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let arr = [];
        const res = await axios.get(`/tasks/user/${user._id}/week`);
        res.data.sort((p1, p2) => {
          return new Date(p1.startTime) - new Date(p2.startTime);
        });

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].projectId) {
            arr.push({
              project: res.data[i].projectTitle,
              task: res.data[i].title,
              duration: `${(
                "00" + Math.floor(res.data[i].taskDuration / 3600)
              ).slice(-2)}:${(
                "00" +
                (Math.floor(res.data[i].taskDuration / 60) % 60)
              ).slice(-2)}:${("00" + (res.data[i].taskDuration % 60)).slice(
                -2
              )}`,
              billableDuration: `${(
                "00" + Math.floor(res.data[i].taskDuration / 3600)
              ).slice(-2)}:${(
                "00" +
                (Math.floor(res.data[i].taskDuration / 60) % 60)
              ).slice(-2)}:${("00" + (res.data[i].taskDuration % 60)).slice(
                -2
              )}`,
            });
          } else {
            arr.push({
              project: "",
              task: res.data[i].title,
              duration: `${(
                "00" + Math.floor(res.data[i].taskDuration / 3600)
              ).slice(-2)}:${(
                "00" +
                (Math.floor(res.data[i].taskDuration / 60) % 60)
              ).slice(-2)}:${("00" + (res.data[i].taskDuration % 60)).slice(
                -2
              )}`,
              billableDuration: `00:00:00`,
            });
          }
        }
        setCsvData(arr);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user._id]);

  const handleOpen = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    } else {
      setOpen(!open);
    }
  };

  return (
    <>
      <div className="whole" onClick={handleOpen}></div>
      <div className="navbar">
        <div className="wrapper">
          <div className="top">
            <h3>Reports</h3>
            <Link to="/" style={{ textDecoration: "none" }}>
              <h4>Summary</h4>
            </Link>
          </div>
          <div className="download" onClick={() => setOpen(!open)}>
            <DownloadIcon />
            {open && (
              <div className="downloadList">
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename={`TimeTracker_report_${format(
                    moment().startOf("isoweek").toDate(),
                    "yyyy-MM-dd"
                  )}_${format(
                    moment().endOf("isoweek").toDate(),
                    "yyyy-MM-dd"
                  )}.csv`}
                  className="link"
                >
                  <p>Download CSV</p>
                </CSVLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
