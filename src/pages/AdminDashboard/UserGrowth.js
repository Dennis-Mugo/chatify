import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import {
  baseUrl,
  getNewUsersGraphUrl,
  months,
} from "../../constants/constants";

function UserGrowth(props) {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserGrowth();
  }, []);

  const fetchUserGrowth = async () => {
    let now = Date.now();
    let currMonth = new Date(now).getMonth() + 1;
    let monthInterval = 6;
    setLoading(true);
    try {
      let res = await fetch(`${getNewUsersGraphUrl}/get_new_monthly_users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxMonth: currMonth,
          minMonth:
            currMonth - monthInterval < 1
              ? currMonth + monthInterval + 1
              : currMonth - monthInterval + 1,
        }),
      });
      res = await res.json();
      // console.log(res);
      setResult(res);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="admin_row1col2">
      {loading ? (
        <></>
      ) : (
        <LineChart
          xAxis={[
            {
              id: "Months",
              data: result?.order,
              // scaleType: 'time',
              scaleType: "point",
              valueFormatter: (d) => months[d - 1],
            },
          ]}
          series={[
            {
              label: "New users per month",
              data: result?.order.map((monthNum) => result?.countObj[monthNum]),
              area: true,
            },
          ]}
          width={600}
          height={300}
        />
      )}
    </div>
  );
}

export default UserGrowth;
