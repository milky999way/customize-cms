// 참조: https://marmelab.com/react-admin/doc/3.3/Authentication.html
import React, { forwardRef } from 'react';
import { useLogout } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

const LogoutButton = forwardRef((props, ref) => {
  const logout = useLogout();
  const handleClick = () => {
    window.location.href = '/logout';
    // logout();
  }
  return (
    <MenuItem onClick={handleClick} ref={ref}>
      <ExitIcon />&nbsp;
      Logout
    </MenuItem>
  );
});

export default LogoutButton;