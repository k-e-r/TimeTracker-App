import "./featured.scss";
import "./progressBar.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import useCalculate from "../../hooks/useCalculate";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Featured = () => {
  const { user } = useContext(AuthContext);
  const [durationAll, setDurationAll] = useState(0);
  const [data, setData] = useState([]);
  const [withProject, setWithProject] = useState();
  const [color, setColor] = useState([]);
  const [getTasks, setGetTasks] = useState([]);
  const [getProjects, setGetProjects] = useState([]);
  const taskArr = useCalculate(getTasks, getProjects);

  useEffect(() => {
    const loadData = async () => {
      const resTasks = await axios.get(`/tasks/user/${user._id}`);
      const resProjects = await axios.get(`/projects/user/${user._id}`);
      setGetTasks(resTasks.data);
      setGetProjects(resProjects.data);
    };
    loadData();
  }, [user._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let sum = 0;
        let colorArr = [];
        let array = [];
        const resultOdd = taskArr.filter((n, i) => i % 2 === 1);
        const resultEven = taskArr.filter((n, i) => i % 2 === 0);

        for (let i = 0; i < getProjects.length; i++) {
          sum += getTasks[i].taskDuration;
          colorArr.push(getProjects[i].colorCode);
          array.push({
            name: resultEven[i].title,
            value: resultOdd[i],
          });
        }
        for (let i = 0; i < resultOdd.length; i++) {
          sum += resultOdd[i];
        }
        setDurationAll(sum);
        setWithProject(sum - resultOdd.slice(-1)[0]);
        setData(array);
        setColor(colorArr);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [getProjects, getTasks]);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">
          <AvTimerIcon sx={{ fontSize: "28px" }} />
          Total Time
        </h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Legend layout="horizontal" verticalAlign="top" align="top" />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={color[index % color.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">CLOCKED HOURS</div>
            <div className="itemResult">
              <div className="resultAmount">
                {`${("00" + Math.floor(durationAll / 3600)).slice(-2)}:${(
                  "00" +
                  (Math.floor(durationAll / 60) % 60)
                ).slice(-2)}:${("00" + (durationAll % 60)).slice(-2)}`}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">BILLABLE HOURS</div>
            <div className="itemResult">
              <div className="resultAmount">{`${(
                "00" + Math.floor(withProject / 3600)
              ).slice(-2)}:${("00" + (Math.floor(withProject / 60) % 60)).slice(
                -2
              )}:${("00" + (withProject % 60)).slice(-2)}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
