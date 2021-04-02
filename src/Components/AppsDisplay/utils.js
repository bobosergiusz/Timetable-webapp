import { Card, Col, Row, Popover, Button } from "antd";

import { HOUR_PIXELS } from "./config";
import { FIRST_HOUR, LAST_HOUR } from "../../config";

const MILIS_IN_HOUR = 60 * 60 * 1000;

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

const layoutCards = (
  day,
  data,
  acceptAppointment,
  cardClassNameAccepted,
  cardClassNamePending,
  owner,
  userToken
) => {
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
    (item) =>
      createGroup(
        item,
        acceptAppointment,
        cardClassNameAccepted,
        cardClassNamePending,
        owner,
        userToken
      )
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

const createGroup = (
  group,
  acceptAppointment,
  cardClassNameAccepted,
  cardClassNamePending,
  owner,
  userToken
) => {
  const lowerLimit = group.since;
  const upperLimit = group.until;
  const columnsArray = group.columns;

  const columns = columnsArray.map((col, id) => (
    <Col flex="1" key={id} style={{ minWidth: 0 }}>
      {pushBetween(col, lowerLimit, upperLimit, (item) =>
        createCard(
          item,
          acceptAppointment,
          cardClassNameAccepted,
          cardClassNamePending,
          owner,
          userToken
        )
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
const createCard = (
  item,
  acceptAppointment,
  classNameAccepted,
  classNamePending,
  accountName,
  token
) => {
  const milis = item.until - item.since;
  const height = (milis / MILIS_IN_HOUR) * HOUR_PIXELS;
  const card = (
    <Card
      style={{ height: height }}
      className={item?.accepted ? classNameAccepted : classNamePending}
    />
  );
  const html =
    item?.accepted == null ? (
      card
    ) : (
      <Popover
        trigger="click"
        content={
          <Card>
            <div>{item.fromUser}</div>
            <div>{item.since.format("HH:mm")}</div>
            <div> {item.until.format("HH:mm")}</div>
            <div>{item.description}</div>

            <Button
              disabled={item.accepted}
              onClick={() => acceptAppointment(accountName, item.id, token)}
            >
              Accept Me!
            </Button>
          </Card>
        }
      >
        {card}
      </Popover>
    );
  return html;
};

export { binDataIntoDays, layoutCards };
