import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";


const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="charts">
          <Featured />
          <Chart aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">
            <ViewListOutlinedIcon fontSize="large" />
            Your Projects
          </div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
