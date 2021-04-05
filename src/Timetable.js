import React, { useState, useEffect } from "react";
import { DatePicker, Divider, Layout, Row, Col, message } from "antd";
import moment from "moment";

import PropTypes from "prop-types";

import DaysRibbon from "./Components/DaysRibbon/DaysRibbon";
import AppsDisplay from "./Components/AppsDisplay/AppsDisplay";
import AppCreation from "./Components/AppCreation/AppCreation";
import { daysOfTheWeekFromDate } from "./utils";

import "./Timetable.css";

const { Header, Content } = Layout;

function Timetable({ Endpoint, accountName }) {
  const [baseDay, setBaseDay] = useState(moment().startOf("Week"));
  const daysToDisplay = daysOfTheWeekFromDate(baseDay);

  const [dataToDisplay, setDataToDisplay] = useState([]);
  useEffect(() => {
    Endpoint.getAppointments(accountName).then((res) => {
      setDataToDisplay(res);
    });
  }, []);

  const addAppointment = (accountName, since, until, description) => {
    Endpoint.postAppointment(accountName, since, until, description).then(
      () => {
        message.success("Appointment proposed!", 3);
        Endpoint.getAppointments(accountName).then((res) =>
          setDataToDisplay(res)
        );
      },
      () => message.error("There was some error!", 3)
    );
  };

  const acceptAppointment = (accountName, id) => {
    Endpoint.putAppointment(accountName, id).then(
      () => {
        message.success("Appointment accepted!", 3);
        Endpoint.getAppointments(accountName).then((res) =>
          setDataToDisplay(res)
        );
      },
      () => message.error("There was some error!", 3)
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
              value={baseDay.clone().add(1, "week")}
              onChange={(date) =>
                setBaseDay(
                  date == null ? baseDay : date.startOf("month").startOf("Week")
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
              addAppointment={addAppointment}
              owner={accountName}
            ></AppCreation>
          </Col>
        </Row>
      </Header>
      <Content className="timetable">
        <DaysRibbon
          days={daysToDisplay}
          backWeek={() => setBaseDay(baseDay.clone().subtract(1, "week"))}
          forwardWeek={() => setBaseDay(baseDay.clone().add(1, "week"))}
        />
        <Divider />
        <AppsDisplay
          data={dataToDisplay}
          days={daysToDisplay}
          acceptAppointment={acceptAppointment}
          owner={accountName}
        />
        <div className="footer-divider"></div>
      </Content>
    </Layout>
  );
}

Timetable.propTypes = {
  Endpoint: PropTypes.object,
  accountName: PropTypes.string,
};

export default Timetable;
