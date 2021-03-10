import { useState } from "react";
import { Button, Popover, Card, DatePicker, Row, Space } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

import { FIRST_HOUR, LAST_HOUR } from "../../config";

const { RangePicker } = DatePicker;

const AppCreation = ({ addAppointment }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <Popover
      trigger="hover"
      placement="bottom"
      visible={hovered}
      onVisibleChange={(visible) => (!clicked ? setHovered(visible) : null)}
      content={<TitleCard></TitleCard>}
    >
      <Popover
        trigger="click"
        placement="bottom"
        content={
          <InputCard
            addAppointment={(since, until) => addAppointment(since, until)}
          />
        }
        visible={clicked}
        onVisibleChange={(visible) => setClicked(visible)}
      >
        <Button
          type="text"
          size="large"
          icon={<PlusSquareOutlined style={{ fontSize: "45px" }} />}
          onClick={() => setHovered(false)}
        />
      </Popover>
      ;
    </Popover>
  );
};

const TitleCard = () => (
  <div className="add-appointment-hover">Add new appointment!</div>
);

function InputCard({ addAppointment }) {
  const [since, setSince] = useState(false);
  const [until, setUntil] = useState(false);

  const setRange = (since, until) => {
    setSince(since);
    setUntil(until);
  };

  const disabledHours1 = Array(FIRST_HOUR)
    .fill()
    .map((x, i) => i);
  const disabledHours2 = Array(24 - LAST_HOUR)
    .fill()
    .map((x, i) => LAST_HOUR + i + 1);
  const disabledHours = disabledHours1.concat(disabledHours2);
  return (
    <Card
      className="add-appointment-input"
      bordered={false}
      title="Fill information of the appointment"
    >
      <Space direction="vertical">
        <Row>
          <RangePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              minuteStep: 5,
              format: "HH:mm",
              disabledHours: () => disabledHours,
            }}
            onChange={(dates) => setRange(dates[0], dates[1])}
          ></RangePicker>
        </Row>
        <Row justify="center">
          <Button onClick={() => addAppointment(since, until)}>Add</Button>
        </Row>
      </Space>
    </Card>
  );
}

AppCreation.propTypes = {
  addAppointment: PropTypes.func,
};
InputCard.propTypes = {
  addAppointment: PropTypes.func,
};
export default AppCreation;
