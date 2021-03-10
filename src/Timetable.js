import React, { useState, useEffect } from "react";
import { DatePicker, Divider, Layout, Row, Col } from "antd";
import moment from "moment";

import DaysRibbon from "./Components/DaysRibbon/DaysRibbon";
import AppsDisplay from "./Components/AppsDisplay/AppsDisplay";
import AppCreation from "./Components/AppCreation/AppCreation";
import { daysOfTheWeekFromDate } from "./utils";

import FakeEndpoint from "./FakeEndpoint";

import "./Timetable.css";

//TODO in appcreation
//validate at least 5 minutes chosen
//cant choose past

//TODO: fix all errors

const { Header, Content } = Layout;

function Timetable() {
  const [baseMonday, setBaseMonday] = useState(moment().startOf("isoWeek"));
  const daysToDisplay = daysOfTheWeekFromDate(baseMonday);

  const [dataToDisplay, setDataToDisplay] = useState([]);
  useEffect(() => {
    setDataToDisplay(FakeEndpoint.getAppointments());
  }, []);

  const addAppointment = (since, until) => {
    FakeEndpoint.postAppointment(since, until);
    setDataToDisplay(FakeEndpoint.getAppointments());
  };

  const acceptAppointment = (id) => {
    FakeEndpoint.putAppointment(id);
    setDataToDisplay(FakeEndpoint.getAppointments());
  };

  return (
    <Layout>
      <Header className="timetable timetable-header">
        <Row>
          <Col span="12">
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
          </Col>
          <Col span="12">
            <AppCreation
              addAppointment={(since, until) => addAppointment(since, until)}
            ></AppCreation>
          </Col>
        </Row>
      </Header>
      <Content className="timetable">
        <DaysRibbon
          days={daysToDisplay}
          backWeek={() => setBaseMonday(baseMonday.clone().subtract(1, "week"))}
          forwardWeek={() => setBaseMonday(baseMonday.clone().add(1, "week"))}
        />
        <Divider />
        <AppsDisplay
          data={dataToDisplay}
          days={daysToDisplay}
          acceptAppointment={(id) => acceptAppointment(id)}
        />
        <div className="footer-divider"></div>
      </Content>
    </Layout>
  );
}

export default Timetable;
