import React, { useState } from 'react';
import { ImageInput, FormDataConsumer, TextInput } from 'react-admin';
import { Button, Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Checkbox, InputLabel, MenuItem, FormControl, FormControlLabel, Select, GridList, GridListTile, GridListTileBar, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AWS from 'aws-sdk';



const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#61a98b',
    color: '#ffffff',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    margin: theme.spacing(4),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    '& > li': {
      textAlign: 'center',
    },
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  checkbox: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(4),
    width: '70%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  titleBar: {
    background: 'rgba(0, 0, 0, 0.6)',
  },
  imageInput: {
    '& > div > div': {
      display: 'none',
    },
    '& > div > .previews': {
      display: 'block',
    },
    '& > div > .previews > div': {
      margin: '0 0.5rem',
      minHeight: '14rem',
      textAlign: 'center',
    },
    '& > div > .previews > div > button': {
      display: 'none',
    },
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});















export default function FullScreenDialog({
  // record,
  stateImgUrl,
  setStateImgUrl,
  stateEnImgUrl,
  setStateEnImgUrl,
  stateJaImgUrl,
  setStateJaImgUrl,
  stateKoImgUrl,
  setStateKoImgUrl,
  imgField,
  fieldName,
  callAppSource,
  setCallAppSource,
  ...props }) {


  /* STYLES */
  const classes = useStyles();

  /* STATES */
  const [open, setOpen] = useState(false);
  const [stateSelectItem, setStateSelectItem] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedName, setSelectedName] = useState('');
  //const [imageList, setImageList] = useState([]);
  //const [checked, setChecked] = useState([]);
  //const [imageLoading, setImageLoading] = useState(false);

  /* EVENT HANDLERS */
  const handleClickOpen = () => {
    // 팝업 오픈
    setOpen(true);
    // S3 앱빌드 목록 호출
    fetch('/api/appcenterGames/useS3Appbuild')
      .then(response => {
        return response.json();
      })
      .then(data => {
        //console.log(data);
        setStateSelectItem(data);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectS3App = (event) => {
    setCallAppSource(event.currentTarget.getAttribute('name'));
    setOpen(false);
  };

  //const handleAdd = () => {
  //  console.log(selectedValue);
  //  console.log(selectedName);
  //  setCallAppSource(selectedName);
  //  setOpen(false);
  //};

  return (
    <div>
      <Button variant="contained" component="span" onClick={handleClickOpen} style={{ backgroundColor: '#61a98b', color: '#fff' }}>
        xxx 매칭하기
      </Button>

      <FormDataConsumer>
        {({ formData, ...rest }) => {
          if (formData.id === undefined) { // 초기 입력데이터가 없는 create 페이지
            return (
              <div><TextInput source={callAppSource} style={{ width: '50%' }} label="매칭된 경로" /></div>
            )
          } else { // 초기 입력데이터가 있는 edit 페이지
            return (
              <div><TextInput source={callAppSource} style={{ width: '50%' }} label="매칭된 경로" /></div>
            )
          }
        }}
      </FormDataConsumer>


      {/* 풀스크린 팝업 */}
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} style={{ background: 'url(https://www.xxx.com/favicon-32x32.png) no-repeat left center / contain', paddingLeft: '40px' }}>
              xxx 매칭
            </Typography>
            {/*<Button autoFocus color="inherit" onClick={handleAdd}>*/}
            {/*  ADD*/}
            {/*</Button>*/}
          </Toolbar>
        </AppBar>
        <FormControl className={classes.formControl}>
          <InputLabel id="s3-appbuild-select">S3 AppBuild</InputLabel>
          <Select
            labelId="s3-appbuild-select"
            id="s3-appbuild-select"
            value={selectedValue}
            name={selectedName}
            onChange={handleSelectS3App}
          >
            {stateSelectItem.map((item, i) => {
              return <MenuItem value={item.Bucket} key={i} name={item.Key}>{item.Key}</MenuItem>
            })}
          </Select>
        </FormControl>

        {/*<div className={classes.root}>*/}
        {/*  ABC*/}
        {/*</div>*/}

      </Dialog>
    </div>
  );
}