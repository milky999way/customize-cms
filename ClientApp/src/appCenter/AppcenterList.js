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

  return (
    <Card>
      <Title title="xxx - AppCenter" />
      <CardHeader title="사내 앱센터" />
      <CardContent>
        <p>게임관리 현황</p>
        <p>공지/이벤트 현황</p>
      </CardContent>
    </Card>
  );
}