import React, { useState, useEffect } from "react";
import { DatePicker, Divider, Layout, Row, Col } from "antd";
import moment from "moment";

import PropTypes from "prop-types";

import DaysRibbon from "./Components/DaysRibbon/DaysRibbon";
import AppsDisplay from "./Components/AppsDisplay/AppsDisplay";
import AppCreation from "./Components/AppCreation/AppCreation";
import { daysOfTheWeekFromDate } from "./utils";

import "./Timetable.css";

const { Header, Content } = Layout;

function Timetable({ Endpoint }) {
  const [baseMonday, setBaseMonday] = useState(moment().startOf("isoWeek"));
  const daysToDisplay = daysOfTheWeekFromDate(baseMonday);

  const [dataToDisplay, setDataToDisplay] = useState([]);
  useEffect(() => {
    Endpoint.getAppointments().then((res) => setDataToDisplay(res));
  }, []);

  const addAppointment = (since, until) => {
    Endpoint.postAppointment(since, until).then(() =>
      Endpoint.getAppointments().then((res) => setDataToDisplay(res))
    );
  };

  const acceptAppointment = (id) => {
    Endpoint.putAppointment(id).then(() =>
      Endpoint.getAppointments().then((res) => setDataToDisplay(res))
    );
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

Timetable.propTypes = {
  Endpoint: PropTypes.object,
};

export default Timetable;
