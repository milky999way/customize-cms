import React, { useState, useEffect } from 'react';
import { usePermissions } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import { Title } from 'react-admin';
import decodeJwt from 'jwt-decode';

const useStyles = makeStyles({
  icon: {
    width: '0.5em',
    paddingLeft: 2,
  },
});

export default () => {
  const classes = useStyles();
  const [stateLoading, setStateLoading] = useState(true);
  const [stateUserName, setStateUserName] = useState();
  const { permissions } = usePermissions();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (stateLoading && token) {
      fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }).then(response => {
        // console.log(response.status);
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          return Promise.reject();
        }
        // if (response.status < 200 || response.status >= 300) {
        //   throw new Error(response.statusText);
        // }
        return response;
      })

      const decodedToken = decodeJwt(token);
      setStateUserName(decodedToken.userName);
    }
    setStateLoading(false);
  });

  return (
    <Card>
      <Title title="CMS - Dashboard" />
      <CardHeader title="WEBSERVICE ADMIN" />
      <CardContent>
        <p><strong style={{ backgroundColor: '#004b3e', color: '#fff', borderRadius: '3px', padding: '3px 6px', fontSize: '0.7rem' }}>TREETIVE</strong>&nbsp;&nbsp;<strong style={{ color: '#0bab8b' }}>{stateUserName}</strong> 님이 로그인하셨습니다.</p>
        <p><strong style={{ backgroundColor: '#004b3e', color: '#fff', borderRadius: '3px', padding: '3px 6px', fontSize: '0.7rem' }}>AUTHORITY</strong>&nbsp;&nbsp;
          {permissions !== undefined ?
            permissions.length === 0 ?
              <span>관리자 권한이 필요하시면 ITS팀에 문의해주세요.</span>
            :
            permissions.map((permission, i) => {
              return (
                <span key={i}>
                  {permission.replace('RESOURCE:::','')}
                  {permissions.length !== i+1 ? ', ' : null}
                </span>
              )
            })
            : null
          }
        </p>
        <ul>
          <li><a href="https://www.xxx.com/" target="_blank" rel="noopener noreferrer">www.xxx.com <LaunchIcon className={classes.icon} /></a></li>
          <li><a href="https://www.xxx.com/" target="_blank" rel="noopener noreferrer">www.xxx.com <LaunchIcon className={classes.icon} /></a></li>
          <li><a href="https://www.xxx.com/episode" target="_blank" rel="noopener noreferrer">www.xxx.com/episode <LaunchIcon className={classes.icon} /></a></li>
          <li><a href="https://www.xxx.com/" target="_blank" rel="noopener noreferrer">www.xxx.com <LaunchIcon className={classes.icon} /></a></li>
        </ul>
      </CardContent>
    </Card>
  );
}