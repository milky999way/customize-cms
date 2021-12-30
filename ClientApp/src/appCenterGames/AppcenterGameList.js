import React from 'react';
import { List, Datagrid, TextField, FileField, DateField, ImageField, NumberField, BooleanInput, SimpleForm, TextInput, Filter, DatagridBody, EditButton, BooleanField } from 'react-admin';
import { Typography, Box, Checkbox, Button, Toolbar, FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  appcenterGameTalbe: {
    '& > thead': {
    },
    '& > thead > tr > th': {
      textAlign: 'center'
    },
    '& > tbody > tr > td': {
      textAlign: 'center'
    },
  },
  appcenterGameIcon: {
    '& > img': {
      maxWidth: '75px'
    },
  }
}));








const MyDatagridRow = ({ record, resource, id, onToggleItem, children, selected, basePath }) => {


  const handleHotGame = (id, e) => {
    //e.stopPropagation();
    const answer = window.confirm("HOT 설정은 1개의 게임만 가능합니다.\n기존 설정된 HOT 게임을 해지하고 새롭게 등록하시겠습니까?");
    if (answer) {
      //console.log(answer);
      //e.target.checked = true;
      //fetch('/api/appcenterGames/settingHotgame')
      //  .then(response => {
      //    return response.text();
      //  }).then(data => {
      //    alert(data);
      //  });

      //const formData = new FormData();
      //formData.append('id', id);
      //formData.append('hotGame', hotGame);

      fetch('/api/appcenterGames/settingHotgame/'+id, {
        method: 'PUT',
        //body: formData
      }).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
      });
    }
  }


  const useGame = (e) => {
    const answer = window.confirm("이용중지를 해제하시겠습니까?");
    if (answer) {
      console.log(answer);
    }
  }
  const unuseGame = (e) => {
    const answer = window.confirm("이용중지 설정 시 사용자 화면에 '지금은 이용이 불가합니다'\n안내가 표시되고 게임상세페이지가 비활성화됩니다.\n설정하시겠습니까?");
    if (answer) {
      console.log(answer);
    }
  }


  return (
    <TableRow key={id} style={id === 5 ? { backgroundColor: '#e0e0e0', opacity: '0.5' } : {}}>
      {/* first column: selection checkbox */}
      <TableCell>
        {/* record.selectable && <Checkbox
          checked={selected}
          onClick={() => onToggleItem(id)}
        /> */}
        <Checkbox
          checked={selected}
          onClick={() => onToggleItem(id)}
        />
      </TableCell>



      {/* data columns based on children */}
      {React.Children.map(children, field => (
        <TableCell key={`${id}-${field.props.source}`}>
          {React.cloneElement(field, {
            record,
            basePath,
            resource,
          })}

        </TableCell>
      ))}

      <TableCell style={{ borderTop: '1px solid #cccccc' }}>
        <Button style={{ backgroundColor: '#f44336', color: '#ffffff' }} onClick={(e) => handleHotGame(6, e)}>HOT</Button>
        <Button style={{ border: '1px solid #f44336', color: '#f44336' }} onClick={(e) => handleHotGame(6, e)} className="hot_game">HOT</Button>
      </TableCell>
      <TableCell style={{ borderTop: '1px solid #e0e0e0' }}>
        <Button style={{ padding: '0', margin: '0 5px', backgroundColor: '#0bab8b', color: '#fff' }}>▲</Button>
        <Button style={{ padding: '0', margin: '0 5px', backgroundColor: '#0bab8b', color: '#fff' }}>▼</Button>
      </TableCell>
      <TableCell style={{ borderTop: '1px solid #e0e0e0' }}>
        {id === 5 ?
          <Button style={{ backgroundColor: '#007bff', color: '#ffffff' }} onClick={useGame}>이용중지 해제</Button>
          :
          <Button style={{ backgroundColor: '#e0e0e0', color: '#000000' }} onClick={unuseGame}>이용중지</Button>
        }
      </TableCell>
    </TableRow>
  );
}

const MyDatagridBody = props => <DatagridBody {...props} row={<MyDatagridRow />} />;
const MyDatagrid = props => <Datagrid {...props} body={<MyDatagridBody />} />;





const AppcenterGameList = (props) => {
  /* STYLES */
  const classes = useStyles();

  return (
    <List {...props}>
      <MyDatagrid className={classes.appcenterGameTalbe}>
        {/*<TextField source="id" />*/}
        <NumberField source="index" />
        <TextField source="name" />
        <TextField source="version" />
        {/*<FileField source="icon" title="icon" />*/}
        <ImageField source="icon.source" className={classes.appcenterGameIcon} />
        <DateField source="updateDate" />
        <BooleanField source="hotGame" />


        {/*<DateField source="launching.date" />*/}
        {/*<TextField source="channel[0].sns" />*/}
        <EditButton />
      </MyDatagrid>

      {/* <Datagrid rowClick="show">
      <TextField source="id" />
      <FileField source="icon" title="icon" />
      <TextField source="title" />
      <DateField source="updateDate" />
      <NumberField source="count" />
      <BooleanInput source="commentable" label="Commentable" />
      <BooleanInput source="commentable" label="Commentable" />
    </Datagrid> */}
    </List>
  );
}

export default AppcenterGameList;