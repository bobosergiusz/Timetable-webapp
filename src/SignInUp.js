import { useState } from "react";
import { Row, Col, Card, Form, Input, Button, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

import "./SignInUp.css";
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const formLayoutWithOutLabel = {
  wrapperCol: {
    span: 16,
    offset: 4,
  },
};

function SignInUp({ onSignUp, onSignIn }) {
  return (
    <div>
      <div style={{ height: 10 }}></div>
      <Row justify="space-around">
        <Col span={8}>
          <SignInCard onSignIn={onSignIn} />
        </Col>
      </Row>
      <Divider>Or</Divider>
      <Row justify="space-around">
        <Col span={8}>
          <SignUpCard onSignUp={onSignUp} />
        </Col>
      </Row>
    </div>
  );
}

function SignInCard({ onSignIn }) {
  const onFinish = (values) => {
    onSignIn(values.accountName, values.password);
  };
  return (
    <Card title="Sign In" bordered={false}>
      <Form {...formLayout} onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="accountName"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

function SignUpCard({ onSignUp }) {
  const [activeTab, setActiveTab] = useState("client");
  const tabList = [
    { key: "client", tab: "Client" },
    { key: "service", tab: "Service" },
  ];
  const onTabChange = (key) => {
    setActiveTab(key);
  };
  const forms = {
    client: <CreateClientForm onSignUp={onSignUp} />,
    service: <CreateServiceForm onSignUp={onSignUp} />,
  };
  return (
    <Card
      title="Sign up"
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={(key) => onTabChange(key)}
    >
      {forms[activeTab]}
    </Card>
  );
}

function CreateClientForm({ onSignUp }) {
  const onFinish = (values) => {
    values.type = "client";
    onSignUp(values);
  };
  return (
    <Form {...formLayout} onFinish={onFinish}>
      <Form.Item
        label="Username"
        name="accountName"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
            type: "email",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}

function CreateServiceForm({ onSignUp }) {
  const onFinish = (values) => {
    values.type = "service";
    onSignUp(values);
  };
  return (
    <Form {...formLayout} onFinish={onFinish}>
      <Form.Item
        label="Username"
        name="accountName"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
            type: "email",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.List
        name="tags"
        rules={[
          {
            validator: async (_, tags) => {
              if (!tags || tags.length < 1) {
                return Promise.reject(new Error("Input at least one tag!"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formLayout : formLayoutWithOutLabel)}
                label={index === 0 ? "Tags" : ""}
                required={true}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input a tag or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input style={{ width: "60%" }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item {...formLayoutWithOutLabel}>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "60%" }}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}

SignInUp.propTypes = {
  onSignUp: PropTypes.func,
  onSignIn: PropTypes.func,
};

SignInCard.propTypes = {
  onSignIn: PropTypes.func,
};
SignUpCard.propTypes = {
  onSignUp: PropTypes.func,
};
CreateClientForm.propTypes = {
  onSignUp: PropTypes.func,
};
CreateServiceForm.propTypes = {
  onSignUp: PropTypes.func,
};

export default SignInUp;
