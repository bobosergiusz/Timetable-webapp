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

function Timetable({ Endpoint, accountName, userToken }) {
  const [baseMonday, setBaseMonday] = useState(moment().startOf("isoWeek"));
  const daysToDisplay = daysOfTheWeekFromDate(baseMonday);

  const [dataToDisplay, setDataToDisplay] = useState([]);
  useEffect(() => {
    Endpoint.getAppointments(accountName, userToken).then((res) => {
      setDataToDisplay(res);
    });
  }, []);

  const addAppointment = (accountName, since, until, description, token) => {
    Endpoint.postAppointment(
      accountName,
      since,
      until,
      description,
      token
    ).then(
      () => {
        message.success("Appointment proposed!");
        Endpoint.getAppointments(accountName, token).then((res) =>
          setDataToDisplay(res)
        );
      },
      () => message.error("There was some error!")
    );
  };

  const acceptAppointment = (accountName, id, token) => {
    Endpoint.putAppointment(accountName, id, token).then(
      () => {
        message.success("Appointment accepted!");
        Endpoint.getAppointments(accountName, token).then((res) =>
          setDataToDisplay(res)
        );
      },
      () => message.error("There was some error!")
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
              addAppointment={addAppointment}
              owner={accountName}
              userToken={userToken}
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
          acceptAppointment={acceptAppointment}
          owner={accountName}
          userToken={userToken}
        />
        <div className="footer-divider"></div>
      </Content>
    </Layout>
  );
}

Timetable.propTypes = {
  Endpoint: PropTypes.object,
  accountName: PropTypes.string,
  userToken: PropTypes.string,
};

export default Timetable;
