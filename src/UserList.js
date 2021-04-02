import { Row, Col, Button } from "antd";

import PropTypes from "prop-types";

function UserList({ servicesToShow, onChoice }) {
  return servicesToShow.map(({ accountName, tags }, i) => (
    <UserRow
      key={i}
      accountName={accountName}
      tags={tags}
      onChoice={onChoice}
    ></UserRow>
  ));
}
function UserRow({ accountName, tags, onChoice }) {
  const onClick = () => {
    onChoice(accountName);
  };
  return (
    <Row>
      <Col>
        <Button type="link" onClick={onClick}>
          {accountName}
        </Button>
      </Col>
      <Col>{tags.join(", ")}</Col>
    </Row>
  );
}
UserList.propTypes = {
  tags: PropTypes.string,
};
UserRow.propTypes = {
  accountName: PropTypes.string,
  tags: PropTypes.array,
  onChoice: PropTypes.func,
};
export default UserList;
