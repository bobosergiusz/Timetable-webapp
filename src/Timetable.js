import React, { useState } from "react";
import { DatePicker, Divider } from "antd";
import { Layout } from "antd";
import moment from "moment";

import DaysRibbon from "./DaysRibbon";
import AppsDisplay from "./AppsDisplay";
import { daysOfTheWeekFromDate } from "./DateUtils";

import "./Timetable.css";

const { Header, Content } = Layout;

function Timetable() {
  const [baseMonday, setBaseMonday] = useState(moment().startOf("isoWeek"));
  const daysToDisplay = daysOfTheWeekFromDate(baseMonday);

  return (
    <Layout>
      <Header className="timetable timetable-header">
        <DatePicker
          picker="month"
          format="MMMM YYYY"
          value={baseMonday.clone().add(1, "week")}
          onChange={(date) =>
            setBaseMonday(
              date == null
                ? baseMonday
                : date.startOf("month").startOf("isoWeek")
            )
          }
          bordered={false}
          allowClear={false}
          size="large"
          className="monthpicker"
        />
      </Header>
      <Content className="timetable">
        <DaysRibbon
          days={daysToDisplay}
          backWeek={() => setBaseMonday(baseMonday.clone().subtract(1, "week"))}
          forwardWeek={() => setBaseMonday(baseMonday.clone().add(1, "week"))}
        />
        <Divider />
        <AppsDisplay days={daysToDisplay} />
        <div className="footer-divider"></div>
      </Content>
    </Layout>
  );
}

export default Timetable;
