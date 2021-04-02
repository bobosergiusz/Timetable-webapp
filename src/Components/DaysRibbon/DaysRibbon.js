import { Row, Col, Button } from "antd";
import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

const DaysRibbon = ({ days, backWeek, forwardWeek }) => (
  <Row align="middle" gutter={8}>
    <Col span={2}>
      <Button
        type="text"
        size="large"
        icon={<LeftSquareOutlined style={{ fontSize: "45px" }} />}
        onClick={() => backWeek()}
      />
    </Col>
    {days.map((day, id) => (
      <DayLabel key={id} date={day} className="day-label" />
    ))}
    <Col span={1}>
      <Button
        type="text"
        size="large"
        icon={<RightSquareOutlined style={{ fontSize: "45px" }} />}
        onClick={() => forwardWeek()}
      />
    </Col>
  </Row>
);

const DayLabel = ({ date, className }) => (
  <Col span={3} className={className}>
    <div className="shadowed-box">
      <div>{date.format("dddd")}</div>
      <div>{date.format("DD")}</div>
    </div>
  </Col>
);

DaysRibbon.propTypes = {
  days: PropTypes.array,
  backWeek: PropTypes.func,
  forwardWeek: PropTypes.func,
};
DayLabel.propTypes = {
  date: PropTypes.Date,
  className: PropTypes.string,
};

export default DaysRibbon;
