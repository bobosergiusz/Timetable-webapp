import { Input } from "antd";
import "./App.css";
import PropTypes from "prop-types";

const { Search } = Input;
function Searchbar({ onSearch }) {
  return (
    <Search
      className="searchbar"
      placeholder="Input tags"
      bordered={false}
      onSearch={(value) => onSearch(value)}
    ></Search>
  );
}

Searchbar.propTypes = {
  onSearch: PropTypes.func,
};
export default Searchbar;
