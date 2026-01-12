// src/components/ChartWidgets.js
import React from "react";
import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "../../Styles/ChartWidgets.css";

/** Info Card Widget **/
export function InfoCard({ title, value, icon, color }) {
  return (
    <Card className="info-card" style={{ backgroundColor: color }}>
      <div className="info-card-body">
        <div className="info-card-icon">{icon}</div>
        <div>
          <h4 className="info-card-title">{title}</h4>
          <p className="info-card-value">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/** Line Chart Widget **/
export function LineChartWidget({ title, data, dataKey }) {
  return (
    <Card className="chart-widget">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#1890ff"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}


/** Pie Chart Widget **/
export function PieChartWidget({
  title,
  total,
  data,
  dataKey,
  nameKey,
  colors = [],
}) {
  return (
    <Card className="chart-widget">
      <h4 className="chart-title">
        {title}
        {typeof total === "number" && (
          <span style={{ fontWeight: 400, color: "#888", marginLeft: 10 }}>
            (Total: {total})
          </span>
        )}
      </h4>
      {Array.isArray(data) && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ label, value }) => `${label}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} (${props.payload.percent}%)`,
                `${props.payload.label}`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
          No breakdown data available
        </div>
      )}
    </Card>
  );
}
/** Bar Chart Widget **/
export function BarChartWidget({
  title,
  data,
  dataKey,
  labelKey,
  barColor = "#722ed1",
}) {
  return (
    <Card className="chart-widget">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
