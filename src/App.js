import React, { useState, useEffect } from "react";
import { Row, Col, Layout, message } from "antd";
import Timetable from "./Timetable";
import SignInUp from "./SignInUp";
import UserSection from "./UserSection";
import Searchbar from "./Searchbar";
import UserList from "./UserList";
import "./App.css";

import FakeEndpoint from "./Adapters/FakeEndpoint";
import HttpEndpoint from "./Adapters/HttpEndpoint";

const env = process.env.NODE_ENV;

const EndpointAdapter = env == "production" ? HttpEndpoint : FakeEndpoint;

const { Header, Content, Footer } = Layout;

const App = () => {
  const [userState, setUserState] = useState({
    userSignedIn: false,
    userData: { accountName: null, jwtToken: null },
  });

  const [curentView, setCurrentView] = useState(
    <UserList servicesToShow={[]} onChoice={setViewTimetable} />
  );

  useEffect(() => setViewService(""), []);

  function setUserSignIn(accountName, jwtToken) {
    setUserState({
      userSignedIn: true,
      userData: { accountName: accountName, jwtToken: jwtToken },
    });
  }
  function setUserSignOut() {
    setUserState({
      userSignedIn: false,
      userData: { accountName: null, jwtToken: null },
    });
  }

  function setViewSignInUp() {
    setCurrentView(<SignInUp onSignUp={onSignUp} onSignIn={onSignIn} />);
  }
  function setViewTimetable(accountName) {
    setCurrentView(
      <Timetable
        Endpoint={EndpointAdapter}
        accountName={accountName}
        userToken={userState.userData?.jwtToken}
      />
    );
  }
  function setViewService(tags) {
    EndpointAdapter.searchServices(tags).then((res) => {
      setCurrentView(
        <UserList servicesToShow={res} onChoice={setViewTimetable}></UserList>
      );
    });
  }

  function onSignIn(accountName, password) {
    EndpointAdapter.login(accountName, password).then(
      (res) => {
        setUserSignIn(accountName, res.token);
        message.success("User signed in!", 10);
      },
      () => message.error("Error occured!")
    );
  }

  function onSignUp(user) {
    EndpointAdapter.createUser(user).then(
      () => {
        message.success("User created!", 10);
      },
      () => message.error("Error occured!")
    );
  }
  return (
    <div>
      <Layout>
        <Header>
          <Row align="middle" justify="space-between">
            <Col span={8}>
              <div className="logo">Schedule a meeting</div>
            </Col>
            <Col span={8}>
              <Searchbar onSearch={setViewService} />
            </Col>
            <Col span={8}>
              <UserSection
                userState={userState}
                onSignIn={setViewSignInUp}
                onSignOut={setUserSignOut}
              />
            </Col>
          </Row>
        </Header>
        <Content>{curentView}</Content>
        <Footer className="footerz">
          Sergiusz Rokosz Inc ©2018 Work of Sergio
        </Footer>
      </Layout>
    </div>
  );
};

export default App;
