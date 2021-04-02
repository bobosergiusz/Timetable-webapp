import { Col, Row } from "antd";

import PropTypes from "prop-types";

import { binDataIntoDays, layoutCards } from "./utils";

import { FIRST_HOUR, LAST_HOUR } from "../../config";
import { HOUR_PIXELS } from "./config";

const AppsDisplay = ({ data, days, acceptAppointment, owner, userToken }) => {
  const binnedData = binDataIntoDays(data, days);

  return (
    <Row gutter={8}>
      <HoursRibbon labelClassName="hour-label" />
      {binnedData.map((bin, id) => (
        <DaySchedule
          key={id}
          day={bin.day}
          data={bin.data}
          className="day-schedule shadowed-box"
          cardClassNameAccepted="appointment-card-pending shadowed-box"
          cardClassNamePending="appointment-card-accepted shadowed-box"
          acceptAppointment={acceptAppointment}
          owner={owner}
          userToken={userToken}
        />
      ))}
    </Row>
  );
};

const HoursRibbon = ({ labelClassName }) => {
  const hourLabels = [];
  for (let i = FIRST_HOUR; i <= LAST_HOUR; i++) {
    hourLabels.push(
      <HourLabel key={i} hour={i + ":00"} className={labelClassName} />
    );
  }
  return <Col span={2}>{hourLabels}</Col>;
};

const DaySchedule = ({
  day,
  data,
  acceptAppointment,
  className,
  cardClassNameAccepted,
  cardClassNamePending,
  owner,
  userToken,
}) => {
  const height = (LAST_HOUR - FIRST_HOUR + 1) * HOUR_PIXELS;
  return (
    <Col span={3}>
      <div className={className} style={{ height: height }}>
        {layoutCards(
          day,
          data,
          acceptAppointment,
          cardClassNameAccepted,
          cardClassNamePending,
          owner,
          userToken
        )}
      </div>
    </Col>
  );
};

const HourLabel = ({ hour, className }) => (
  <Row style={{ height: HOUR_PIXELS }} justify="end">
    <Col className={className}>{hour}</Col>
  </Row>
);

AppsDisplay.propTypes = {
  days: PropTypes.array,
  data: PropTypes.array,
  acceptAppointment: PropTypes.func,
  owner: PropTypes.string,
  userToken: PropTypes.string,
};
HoursRibbon.propTypes = {
  labelClassName: PropTypes.string,
};
HourLabel.propTypes = {
  hour: PropTypes.string,
  className: PropTypes.string,
};
DaySchedule.propTypes = {
  data: PropTypes.array,
  day: PropTypes.Date,
  acceptAppointment: PropTypes.func,
  className: PropTypes.string,
  cardClassNameAccepted: PropTypes.string,
  cardClassNamePending: PropTypes.string,
  owner: PropTypes.string,
  userToken: PropTypes.string,
};
export default AppsDisplay;
export { HOUR_PIXELS };
