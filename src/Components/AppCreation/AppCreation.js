import { useState } from "react";
import { Button, Popover, Card, DatePicker, Form, Input } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

import { FIRST_HOUR, LAST_HOUR } from "../../config";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AppCreation = ({ addAppointment, owner, userToken }) => {
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
            addAppointment={addAppointment}
            owner={owner}
            userToken={userToken}
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

function InputCard({ addAppointment, owner, userToken }) {
  const disabledHours1 = Array(FIRST_HOUR)
    .fill()
    .map((x, i) => i);
  const disabledHours2 = Array(24 - LAST_HOUR)
    .fill()
    .map((x, i) => LAST_HOUR + i + 1);
  const disabledHours = disabledHours1.concat(disabledHours2);

  function onFinish(values) {
    const [since, until] = values.sinceUntil;
    addAppointment(owner, since, until, values.description, userToken);
  }
  const formLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  return (
    <Card
      className="add-appointment-input"
      bordered={false}
      title="Fill information for the appointment"
    >
      <Form name="newAppointment" onFinish={onFinish}>
        <Form.Item
          {...formLayout}
          label="Time range"
          name="sinceUntil"
          rules={[
            {
              required: true,
              message: "Input time for the appointment!",
            },
          ]}
        >
          <RangePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              minuteStep: 5,
              format: "HH:mm",
              disabledHours: () => disabledHours,
            }}
          ></RangePicker>
        </Form.Item>
        <Form.Item
          {...formLayout}
          label="Message"
          name="description"
          rules={[
            {
              required: true,
              message: "Input description!",
            },
          ]}
        >
          <TextArea rows={6} placeholder="Description..."></TextArea>
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button htmlType="submit" type="primary">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

AppCreation.propTypes = {
  addAppointment: PropTypes.func,
  owner: PropTypes.string,
  userToken: PropTypes.string,
};
InputCard.propTypes = {
  addAppointment: PropTypes.func,
  owner: PropTypes.string,
  userToken: PropTypes.string,
};
export default AppCreation;
