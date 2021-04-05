import { Avatar, Popover, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

import PropTypes from "prop-types";

//TODO: add button to see owned calendar if service logged in
//TODO: kalendarz w foormularzu tworzenia app powinien zaczynac sie od poniedzialku
//sign out nie czysci danych logowania
function UserSection({ userState, signInClick, onSignOut }) {
  const popoverContent = userState.userSignedIn ? (
    <UserInfo userState={userState} onSignOut={onSignOut} />
  ) : (
    <SignInButton signInClick={signInClick} />
  );
  return (
    <Popover placement="right" content={popoverContent}>
      <Avatar size={42} style={{ float: "right" }} icon={<UserOutlined />} />
    </Popover>
  );
}

function UserInfo({ userState, onSignOut }) {
  return (
    <div size="small">
      Logged as: <b>{userState.accountName}</b>{" "}
      <Button onClick={() => onSignOut()}>Sign out</Button>
    </div>
  );
}

function SignInButton({ signInClick }) {
  return <Button onClick={() => signInClick()}>Sign in</Button>;
}

UserSection.propTypes = {
  userState: PropTypes.object,
  onSignOut: PropTypes.func,
  signInClick: PropTypes.func,
};
UserInfo.propTypes = {
  userState: PropTypes.object,
  onSignOut: PropTypes.func,
};
SignInButton.propTypes = {
  signInClick: PropTypes.func,
};
export default UserSection;
