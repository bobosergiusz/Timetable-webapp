import { Table, Tag } from "antd";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import "./UserList.css";

const { Column } = Table;

function UserList({ getData, tags, onChoice }) {
  const [servicesToShow, setServicesToShow] = useState([]);
  useEffect(() => getData(tags, setServicesToShow), [tags]);
  return (
    <Table
      dataSource={servicesToShow}
      pagination={false}
      onRow={(record) => {
        return {
          onClick: () => onChoice(record.accountName),
        };
      }}
      rowClassName={() => "row"}
    >
      <Column title="Name" dataIndex="accountName" key="accountName" />
      <Column
        title="Tags"
        dataIndex="tags"
        key="tags"
        render={(tags) => tags.map((tag, key) => <Tag key={key}>{tag}</Tag>)}
      />
    </Table>
  );
}

UserList.propTypes = {
  getData: PropTypes.func,
  tags: PropTypes.array,
  onChoice: PropTypes.func,
};

export default UserList;
