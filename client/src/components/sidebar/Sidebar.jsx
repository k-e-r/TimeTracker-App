import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch({ type: "LOGOUT", payload: null });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='sidebar'>
      <div className='top'>
        <Link to='/' style={{ textDecoration: "none" }}>
          <span className='logo'>TimeTracker</span>
        </Link>
      </div>
      <hr className='sidebarTitleHr' />
      <div className='center'>
        <ul>
          <p className='title'>TRACK</p>
          <Link to='/timer' style={{ textDecoration: "none" }}>
            <li>
              <AccessAlarmIcon className='icon' />
              <span>Timer</span>
            </li>
          </Link>
          <hr className='sidebarHr' />
          <p className='title'>ANALYZE</p>
          <Link to='/' style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className='icon' />
              <span>Dashboard</span>
            </li>
          </Link>
          <hr className='sidebarHr' />
          <p className='title'>MANAGE</p>
          <li>
            <InsertChartIcon className='icon' />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className='icon' />
            <span>Notifications</span>
          </li>
          <hr className='sidebarHr' />
          <p className='title'>SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className='icon' />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className='icon' />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className='icon' />
            <span>Settings</span>
          </li>
          <hr className='sidebarHr' />
          <p className='title'>USER</p>
          <li>
            <AccountCircleOutlinedIcon className='icon' />
            <span>Profile</span>
          </li>
          <li onClick={handleLogout}>
            <ExitToAppIcon className='icon' />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <hr className='sidebarHr' />
      <div className='bottom'>
        <DarkModeOutlinedIcon
          className='colorOption'
          onClick={() => dispatch({ type: "DARK" })}
        />
        <LightModeOutlinedIcon
          className='colorOption'
          onClick={() => dispatch({ type: "LIGHT" })}
        />
      </div>
    </div>
  );
};

export default Sidebar;
