import { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";

import PropTypes from "prop-types";

import FakeEndpoint from "./FakeEndpoint";

const FIRST_HOUR = 8;
const LAST_HOUR = 17;
const HOUR_PIXELS = 100;
const MILIS_IN_HOUR = 60 * 60 * 1000;

const AppsDisplay = ({ days }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(FakeEndpoint.getAppointments());
  });

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
          cardClassName="appointment-card shadowed-box"
        />
      ))}
    </Row>
  );
};

const HoursRibbon = ({ labelClassName }) => {
  const hourLabels = [];
  for (let i = FIRST_HOUR; i <= LAST_HOUR; i++) {
    hourLabels.push(<HourLabel hour={i + ":00"} className={labelClassName} />);
  }
  return <Col span={2}>{hourLabels}</Col>;
};

const DaySchedule = ({ day, data, className, cardClassName }) => {
  const height = (LAST_HOUR - FIRST_HOUR + 1) * HOUR_PIXELS;
  return (
    <Col span={3}>
      <div className={className} style={{ height: height }}>
        {layoutCards(day, data, cardClassName)}
      </div>
    </Col>
  );
};

const HourLabel = ({ hour, className }) => (
  <Row style={{ height: HOUR_PIXELS }} justify="end">
    <Col className={className}>{hour}</Col>
  </Row>
);

const binDataIntoDays = (data, days) => {
  const returnValue = days.map((day) => ({ day: day, data: [] }));

  for (const item of data) {
    const since = item.since.clone().startOf("day");
    const until = item.until.clone().startOf("day");
    for (const [idx, day] of days.entries()) {
      if (since <= day && day <= until) {
        returnValue[idx].data.push(item);
      } else if (until < day) {
        continue;
      }
    }
  }
  return returnValue;
};

const layoutCards = (day, data, cardClassName) => {
  const lowerLimit = day.clone().hour(FIRST_HOUR);
  const upperLimit = day.clone().hour(LAST_HOUR + 1);

  const trimmedData = data.map((item) => {
    const trimmed = Object.assign({}, item);
    if (trimmed.since < lowerLimit) {
      trimmed.since = lowerLimit;
    }
    if (trimmed.until > upperLimit) {
      trimmed.until = upperLimit;
    }
    return trimmed;
  });

  const sortedData = trimmedData.sort((a, b) => a.since - b.since);

  const arrangedData = arrangeData(sortedData);

  const returnValue = pushBetween(
    arrangedData,
    lowerLimit,
    upperLimit,
    (item) => createGroup(item, cardClassName)
  );
  return returnValue;
};

const arrangeData = (data) => {
  const returnValue = [];
  if (data.length == 0) {
    return returnValue;
  }
  returnValue.push({
    since: data[0].since,
    until: data[0].until,
    columns: [[data[0]]],
  });
  for (const item of data.slice(1)) {
    const lastGroup = returnValue[returnValue.length - 1];
    if (lastGroup.until <= item.since) {
      returnValue.push({
        since: item.since,
        until: item.until,
        columns: [[item]],
      });
      continue;
    }
    const ifCanGo = lastGroup.columns.map(
      (col) => col[col.length - 1].until < item.since
    );
    const id = ifCanGo.findIndex((b) => b == true);
    if (id == -1) {
      lastGroup.columns.push([item]);
    } else {
      lastGroup.columns[id].push(item);
    }
    lastGroup.since = Math.min(lastGroup.since, item.since);
    lastGroup.until = Math.max(lastGroup.until, item.until);
  }
  return returnValue;
};

const pushBetween = (data, lowerLimit, upperLimit, transformItem) => {
  const returnValue = [];

  data.push({
    since: upperLimit,
  });

  returnValue.push(createSpace(lowerLimit, data[0].since));

  const tuples = data.slice(0, -1).map((el, i) => [el, data[i + 1]]);

  for (const tup of tuples) {
    const firstItem = tup[0];
    const secondItem = tup[1];
    returnValue.push(transformItem(firstItem));
    returnValue.push(createSpace(firstItem.until, secondItem.since));
  }
  return returnValue;
};

const createGroup = (group, cardClassName) => {
  const lowerLimit = group.since;
  const upperLimit = group.until;
  const columnsArray = group.columns;

  const columns = columnsArray.map((col, id) => (
    <Col flex="1" key={id}>
      {pushBetween(col, lowerLimit, upperLimit, (item) =>
        createCard(item, cardClassName)
      )}
    </Col>
  ));

  return <Row>{columns}</Row>;
};

const createSpace = (since, until) => {
  const milis = until - since;
  const height = (milis / MILIS_IN_HOUR) * HOUR_PIXELS;
  return <div style={{ height: height }} />;
};
const createCard = (item, className) => {
  const milis = item.until - item.since;
  const height = (milis / MILIS_IN_HOUR) * HOUR_PIXELS;
  return (
    <Card style={{ height: height }} className={className} title={item.id} />
  );
};

AppsDisplay.propTypes = {
  days: PropTypes.array,
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
  day: PropTypes.date,
  className: PropTypes.string,
  cardClassName: PropTypes.string,
};
export default AppsDisplay;
