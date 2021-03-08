import React from "react";
import { Layout, Space } from "antd";
import Timetable from "./Timetable";
import "./App.css";

const { Header, Content, Footer } = Layout;

const App = () => (
  <div>
    <Layout>
      <Header>
        <Space size="large">
          <div className="logo">Schedule a meeting</div>
        </Space>
      </Header>
      <Content>
        <Timetable></Timetable>
      </Content>
      <Footer className="footerz">
        Sergiusz Rokosz Inc ©2018 Work of Sergio
      </Footer>
    </Layout>
  </div>
);

export default App;
