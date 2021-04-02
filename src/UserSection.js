import { message, Avatar, Popover, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

//TODO: add button to see owned calendar if service logged in
function UserSection({ userState, onSignIn, onSignOut }) {
  const popoverContent = userState?.userSignedIn ? (
    <UserInfo userData={userState.userData} onSignOut={onSignOut} />
  ) : (
    <SignInButton onSignIn={onSignIn} />
  );
  return (
    <Popover placement="right" content={popoverContent}>
      <Avatar size={42} style={{ float: "right" }} icon={<UserOutlined />} />
    </Popover>
  );
}

function UserInfo({ userData, onSignOut }) {
  return (
    <div size="small">
      Logged as: <b>{userData.accountName}</b>{" "}
      <Button
        onClick={() => {
          onSignOut(), message.info("Signet out!");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}

function SignInButton({ onSignIn }) {
  return <Button onClick={() => onSignIn()}>Sign in</Button>;
}

UserSection.propTypes = {
  userState: PropTypes.object,
  onSignOut: PropTypes.func,
  onSignIn: PropTypes.func,
};
UserInfo.propTypes = {
  userData: PropTypes.object,
  onSignOut: PropTypes.func,
};
SignInButton.propTypes = {
  onSignIn: PropTypes.func,
};
export default UserSection;
