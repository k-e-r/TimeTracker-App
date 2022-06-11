import "./featured.scss";
import "./progressBar.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Project A", value: 400 },
  { name: "Project B", value: 300 },
  { name: "Project C", value: 300 },
  { name: "Project D", value: 200 },
];

const COLORS = ["#FF8882", "#194350cc", "#FFC2B4", "#9DBEB9"];

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
  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">
          <AvTimerIcon />
          Total Time
        </h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
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
                    fill={COLORS[index % COLORS.length]}
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
              <div className="resultAmount">0:00:00</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">BILLABLE HOURS</div>
            <div className="itemResult">
              <div className="resultAmount">0:00:00</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">AMOUNT</div>
            <div className="itemResult">
              <div className="resultAmount">0:00:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
