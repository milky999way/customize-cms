import React, { createElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources, usePermissions } from 'react-admin';
import { withRouter } from 'react-router-dom';
// import LabelIcon from '@material-ui/icons/Label';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import CategoryIcon from '@material-ui/icons/Category';
// import decodeJwt from 'jwt-decode';

const Menu = ({ onMenuClick, logout }) => {
  const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const open = useSelector(state => state.admin.ui.sidebarOpen);
  const resources = useSelector(getResources);
  const { permissions } = usePermissions();

  // const token = localStorage.getItem('token');
  // const decodedToken = decodeJwt(token);
  // const roles = decodedToken.roles.replace(/[."+?^${}()|[\]\\]/g,'');
  // const arrRoles = roles.split(',');
  // console.log(arrRoles);
  // useEffect(() => {
  //   console.log(permissions);
  // });
  return (
    <div>
      <MenuItemLink
        to="/"
        primaryText="Dashboard"
        leftIcon={<ViewModuleIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      />
      {permissions !== undefined &&
        (permissions.includes('RESOURCE:::Administrator') || permissions.includes('RESOURCE:::Episode-Reader') || permissions.includes('RESOURCE:::Episode-Writer')) &&
        <MenuItemLink
          to="/episodes"
          primaryText="Episodes"
          leftIcon={<WebAssetIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />
      }
      {permissions !== undefined &&
        (permissions.includes('RESOURCE:::Administrator') || permissions.includes('RESOURCE:::Quiz-Reader') || permissions.includes('RESOURCE:::Quiz-Writer')) &&
        <MenuItemLink
          to="/quiz"
          primaryText="quiz"
          leftIcon={<CategoryIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />
      }
      {/* {resources.map(resource => (
        <MenuItemLink
          key={resource.name}
          to={`/${resource.name}`}
          primaryText={resource.options && resource.options.label || resource.name}
          leftIcon={createElement(resource.icon)}
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />
      ))}
      <MenuItemLink
        to="/custom-route"
        primaryText="Miscellaneous"
        leftIcon={<LabelIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      /> */}
      {isXSmall && logout}
    </div>
  );
}

export default withRouter(Menu);