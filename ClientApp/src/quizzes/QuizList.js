import React, { useState, useEffect, cloneElement } from 'react';
import { List, Datagrid, TextField, BooleanField, ImageField, ShowButton, EditButton, Button, useDataProvider, TopToolbar, CreateButton, ExportButton, sanitizeListRestProps, Pagination, useRefresh, BulkDeleteButton } from 'react-admin';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import CachedIcon from '@material-ui/icons/Cached';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import IconEvent from '@material-ui/icons/Event';


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  publishButton: { color: '#ff0000' },
  InvalidationButton: { 
    marginLeft: '15px',
    color: '#004b3e',
    backgroundColor: '#cee8d7',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#bdbebd'
    },
    '&:disabled': {
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.13)',
    },
    '& span.MuiButton-startIcon': {
      marginRight: '0',
    },
  },
  InvalidationButton2: { 
    marginLeft: '15px',
    color: '#ffffff',
    backgroundColor: '#0bab8b',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#bdbebd'
    },
    '&:disabled': {
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.26)',
    },
    '& span.MuiButton-startIcon': {
      marginRight: '0',
    },
  }
}));


// 참조: https://marmelab.com/react-admin/doc/3.3/List.html#actions
const ListActions = ({
  permissions,
  currentSort,
  className,
  resource,
  filters,
  displayedFilters,
  exporter, // you can hide ExportButton if exporter = (null || false)
  filterValues,
  permanentFilter,
  hasCreate, // you can hide CreateButton if hasCreate = false
  basePath,
  selectedIds,
  onUnselectItems,
  showFilter,
  maxResults,
  total,
  invalidatingRc,
  invalidatingLive,
  onInvalidation,
  classes,
  ...rest
}) => (
  <>
    {permissions !== undefined && (permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1) ?
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters && cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
      <CreateButton basePath={basePath} />
      <Button
        onClick={(e) => onInvalidation('rc', e)} 
        label="Invalidation (RC)"
        className={classes.InvalidationButton}
        startIcon={<CachedIcon />}
      />
      <Backdrop className={classes.backdrop} open={invalidatingRc}>
        <div style={{ marginRight: '30px', color: 'lightgreen' }}>rc환경 invalidation 중입니다...</div>
        <CircularProgress style={{ 'color': 'lightgreen' }} />
      </Backdrop>
      <Button
        onClick={(e) => onInvalidation('live', e)} 
        label="Invalidation (LIVE)"
        className={classes.InvalidationButton2}
        startIcon={<CachedIcon />}
      />
      <Backdrop className={classes.backdrop} open={invalidatingLive}>
        <div style={{ marginRight: '30px', color: 'yellow' }}>live환경 invalidation 중입니다...</div>
        <CircularProgress style={{ 'color': 'yellow' }} />
      </Backdrop>
    </TopToolbar>
    : null}
  </>
);





const BulkActionButtons = ({ permissions, ...props }) => (
  <>
    {/* default bulk delete action */}
    {permissions !== undefined && (permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1) ?
      <BulkDeleteButton {...props} />
      : null
    }
  </>
);





const QuizList = ({ permissions, ...props }) => {
  const refresh = useRefresh();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [invalidatingRc, setInvalidatingRc] = useState(false);
  const [invalidatingLive, setInvalidatingLive] = useState(false);


  // CloudFront Invalidation 관련 함수
  useEffect(() => {
    if (!pageLoaded) {
      invalidationCheckRc('none/none');
      invalidationCheckLive('none/none');
    }
    setPageLoaded(true);
  });

  ListActions.defaultProps = {
    permissions: permissions,
    classes: useStyles(),
    invalidatingRc: invalidatingRc,
    invalidatingLive: invalidatingLive,
    onInvalidation: (target, e) => {
      e.stopPropagation();
      const answer = window.confirm(target+"환경에 배포하시겠습니까?");
      if (answer) {
        target === 'live' ? setInvalidatingLive(true) : setInvalidatingRc(true);
        fetch('/api/quizzes/invalidationCache/'+target, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }).then(response => {
          return response.json();
        }).then(result => {
          target === 'live' ? invalidationCheckLive(result) : invalidationCheckRc(result);
        });
      }
    },
  };

  const invalidationCheckRc = (paramId) => {
    fetch('/api/quizzes/invalidationCheckRc/'+paramId)
    .then(response => {
      return response.json();
    }).then(result => {
      if (result) {
        setTimeout(() => { invalidationCheckRc(paramId) }, 5000);
        setInvalidatingRc(result);
      } else {
        setInvalidatingRc(result);
      }
    });
  }
  const invalidationCheckLive = (paramId) => {
    fetch('/api/quizzes/invalidationCheckLive/'+paramId)
    .then(response => {
      return response.json();
    }).then(result => {
      if (result) {
        setTimeout(() => { invalidationCheckLive(paramId) }, 5000);
        setInvalidatingLive(result);
      } else {
        setInvalidatingLive(result);
      }
    });
  }


  // Publish & Data Sync 관련 함수
  const PublishField = (props) => {
    const classes = useStyles();
    return <Button label="Publish" startIcon={<PublishIcon />} className={classes.publishButton} onClick={(e) => onPublish(props.record.id, e)} disabled={props.record.dataSync} />;
  }
  const onPublish = (recordId, e) => {
    e.stopPropagation();
    const answer = window.confirm("해당 퀴즈를 live환경에 저장하시겠습니까?");
    if (answer) {
      fetch('/api/quizzes/publishQuiz/' + recordId, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }).then(response => {
        refresh();
        console.log(response);
      });
    }
  }
  const SyncField = (props) => {
    return (
    <>
      {props.record.dataSync ?
        <CheckIcon style={{ width: '125px', margin: '0 auto', color: '#0bab8b' }} />
        :
        <ClearIcon style={{ width: '125px', margin: '0 auto', color: '#ff0000' }} />
      }
    </>
    )
  }


  return (
    <List {...props} sort={{ field: 'index', order: 'DESC' }} actions={<ListActions />} bulkActionButtons={<BulkActionButtons permissions={permissions} />} title="xxx - Quizzes">
      <Datagrid rowClick="show">
        <TextField source="index" />
        <TextField source="title" />
        {/* <TextField source="chapter" /> */}
        {permissions !== undefined && (permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1) ?
          <EditButton />
        : null}
        {permissions !== undefined && (permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1) ?
          <PublishField />
        : null}
        <SyncField label="Data Sync (rc / live)" />
      </Datagrid>
    </List>
  );
};

export default QuizList;