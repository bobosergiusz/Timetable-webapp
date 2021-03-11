import React from "react";
import { Layout, Space } from "antd";
import Timetable from "./Timetable";
import "./App.css";

import FakeEndpoint from "./Adapters/FakeEndpoint";
import HttpEndpoint from "./Adapters/HttpEndpoint";

const env = process.env.NODE_ENV;

const EndpointAdapter = env == "production" ? HttpEndpoint : FakeEndpoint;

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
        <Timetable Endpoint={EndpointAdapter}></Timetable>
      </Content>
      <Footer className="footerz">
        Sergiusz Rokosz Inc ©2018 Work of Sergio
      </Footer>
    </Layout>
  </div>
);

export default App;
