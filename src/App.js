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
    accountName: null,
  });

  const [curentView, setCurrentView] = useState(
    <UserList getData={getServices} tags={""} onChoice={setViewTimetable} />
  );

  useEffect(() => setViewService(""), []);

  function setUserSignIn(accountName) {
    setUserState({
      userSignedIn: true,
      accountName: accountName,
    });
  }
  function setUserSignOut() {
    setUserState({
      userSignedIn: false,
      accountName: null,
    });
  }

  function setViewSignInUp() {
    setCurrentView(<SignInUp onSignUp={onSignUp} onSignIn={onSignIn} />);
  }
  function setViewTimetable(accountName) {
    setCurrentView(
      <Timetable Endpoint={EndpointAdapter} accountName={accountName} />
    );
  }

  function getServices(tags, callback) {
    EndpointAdapter.searchServices(tags).then(callback);
  }
  function setViewService(tags) {
    setCurrentView(
      <UserList
        getData={getServices}
        tags={tags}
        onChoice={setViewTimetable}
      ></UserList>
    );
  }

  function onSignIn(accountName, password) {
    EndpointAdapter.login(accountName, password).then(
      () => {
        setUserSignIn(accountName);
        message.success("User signed in!", 3);
      },
      () => message.error("Error occured!", 3)
    );
  }
  function onSingOut() {
    EndpointAdapter.logout().then(
      () => {
        setUserSignOut();
        message.success("User signed out!", 3);
      },
      () => message.error("Error occured!", 3)
    );
  }

  function onSignUp(user) {
    EndpointAdapter.createUser(user).then(
      () => {
        message.success("User created!", 3);
      },
      () => message.error("Error occured!", 3)
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
              <Row>
                <Searchbar onSearch={setViewService} />
              </Row>
            </Col>
            <Col span={8}>
              <UserSection
                userState={userState}
                signInClick={setViewSignInUp}
                onSignOut={onSingOut}
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
