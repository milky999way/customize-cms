import React, { useState } from 'react';
import { ImageInput, FormDataConsumer } from 'react-admin';
import { Button, Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Checkbox, InputLabel, MenuItem, FormControl, FormControlLabel, Select, GridList, GridListTile, GridListTileBar, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#f5834a',
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
    /*'& > li > div > img.MuiGridListTile-imgFullWidth': {
      transform: 'translateY(0)',
    },*/
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  checkbox: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(4),
    width: '25%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  titleBar: {
    background: 'rgba(0, 0, 0, 0.6)',
  },
  imageInput : {
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
  ...props}) {


  /* STYLES */
  const classes = useStyles();
  
  /* STATES */
  const [open, setOpen] = useState(false);
  const [stateSelectItem, setStateSelectItem] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [imageList, setImageList] = useState([]);
  const [checked, setChecked] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  /* EVENT HANDLERS */
  const handleClickOpen = () => {
    // 구글 드라이브 선택값 초기화
    setSelectedValue('');
    setImageList([]);
    // 팝업 오픈
    setOpen(true);
    // 에피소드 폴더 목록 호출
    fetch('/api/episodes/usegoogledrive')
      .then(response => {
        return response.json();
      })
      .then(data => {
        // console.log(data);
        // 폴더명으로 정렬(역순)
        data.sort(function(a, b){
          const x = parseInt(a.name);
          const y = parseInt(b.name);
          if (x < y) {return 1;}
          if (x > y) {return -1;}
          return 0;
        });
        setStateSelectItem(data);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectGoogleDrive = (event) => {
    // 구글 드라이브 선택값 초기화
    setImageList([]);
    setChecked([]);
    setImageLoading(true);
    // 호출 에피소드
    setSelectedValue(event.target.value);
    setSelectedName(event.currentTarget.getAttribute('name'));
    fetch('/api/episodes/selectgoogledrive/' + event.target.value + '/' + fieldName)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // console.log(data);
        // 이미지명으로 정렬
        data.sort(function(a, b){
          const x = a.imageName.toLowerCase();
          const y = b.imageName.toLowerCase();
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
        });
        setImageList(data);
        setImageLoading(false);
      });
  };

  const handleAllToggle = (event) => {
    if (event.target.checked) {
      let chkLength = [];
      for (let i = 0; i < imageList.length; i++) {
        chkLength.push(i)
      }
      setChecked(chkLength);
    } else {
      setChecked([]);
    }
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAdd = () => {
    if (selectedName && [...checked] && imageList.length !== 0) {
      let langId;
      let fileIds = [];
      [...checked].filter((name) => { return fileIds.push(imageList[name].imageId) }); // 체크된 이미지 아이디 배열에 담기
      [...checked].filter((name) => { return langId = imageList[name].imageFolder }); // 체크된 이미지의 언어필드(폴더 - img, en, ja, ko)
    
      // switch (langId) {
      //   case 'img':
      //     setStateImgUrl([]);
      //     break;
      //   case 'en':
      //     setStateEnImgUrl([]);
      //     break;
      //   case 'ja':
      //     setStateJaImgUrl([]);
      //     break;
      //   case 'ko':
      //     setStateKoImgUrl([]);
      //     break;
      //   default:
      //     console.log('Empty');
      // }
      setImageLoading(true);
      fetch('/api/episodes/addfilelistgoogledrive/'+selectedName+'/'+langId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          fileIds
        )
      }).then(response => {
        return response.json();
      }).then(url => {
        switch (langId) {
          case 'img':
            setStateImgUrl(url);
            break;

          case 'en':
            setStateEnImgUrl(url);
            break;

          case 'ja':
            setStateJaImgUrl(url);
            break;

          case 'ko':
            setStateKoImgUrl(url);
            break;

          default:
            console.log('Target ImageField Empty');
        }
        setImageLoading(false);
      });
    }
    setOpen(false);
  }



  /* FUNTIONAL COMPONENT */
  const PreviewImage = (props) => {
    let fileName = props.record.src.split('/').reverse()[0];
    return (
      <>
        <img src={props.record.src} alt="Image Preview" style={{ margin: '0.5rem', maxHeight: '10rem' }} />
        <p style={{ textAlign: 'center' }}>{fileName}</p>
      </>
    )
  };



  return (
    <div>
      <Button variant="contained" component="span" onClick={handleClickOpen}>
        Google Drive
        <ArrowRightIcon />
        AWS S3
      </Button>
      {imageLoading ?
        <div style={{ textAlign: 'center', padding: '50px 0 100px 0' }}><CircularProgress /></div>
      :
        <FormDataConsumer>
          {({ formData, ...rest }) => {
            if (formData.id === undefined) { // 초기 입력데이터가 없는 create 페이지
              return (
                <ImageInput source={imgField} accept="image/*" multiple={true} label="" className={classes.imageInput}>
                  <PreviewImage source="src" />
                </ImageInput>
              )
            } else { // 초기 입력데이터가 있는 edit 페이지

              if (stateImgUrl.length > 0) {
                formData.img = stateImgUrl.map((url) => { return ({src: url}) });
              }
              if (stateEnImgUrl.length > 0) {
                formData.languageItem[0].img = stateEnImgUrl.map((url) => { return ({src: url}) });
              }
              if (stateJaImgUrl.length > 0) {
                formData.languageItem[1].img = stateJaImgUrl.map((url) => { return ({src: url}) });
              }
              if (stateKoImgUrl.length > 0) {
                formData.languageItem[2].img = stateKoImgUrl.map((url) => { return ({src: url}) });
              }
              return (
                <ImageInput source={imgField} accept="image/*" multiple={true} label="" className={classes.imageInput}>
                  <PreviewImage source="src" />
                </ImageInput>
              )
            }
          }}
        </FormDataConsumer>
      }

      {/* 풀스크린 팝업 */}
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} style={{ background: 'url(https://api.iconify.design/logos:google-drive.svg) no-repeat left center / contain', paddingLeft: '40px' }}>
              Google Drive
            </Typography>
            <Button autoFocus color="inherit" onClick={handleAdd}>
              ADD
            </Button>
          </Toolbar>
        </AppBar>
        <FormControl className={classes.formControl}>
          <InputLabel id="google-drive-select">Episode</InputLabel>
          <Select
            labelId="google-drive-select"
            id="google-drive-select"
            value={selectedValue}
            name={selectedName}
            onChange={handleSelectGoogleDrive}
          >
            {stateSelectItem.map((item, i) => {
              return <MenuItem value={item.id} key={i} name={item.name}>{item.name}</MenuItem>
            })}
          </Select>
        </FormControl>
        
        <div className={classes.root}>
          {imageLoading ?
            <div style={{ padding: '10% 0' }}><CircularProgress /></div>
          :
          <GridList className={classes.gridList} cellHeight={'auto'} spacing={50} cols={5}>
            {imageList.length !== 0 ?
              <li style={{ textAlign: 'center' }}>
                <FormControlLabel
                  control={<Checkbox onChange={handleAllToggle} style={{ color: '#f5834a' }} />}
                  label="Select all"
                  style={{ width: '100%', height: '100%', border: '2px dotted #f5834a', margin: '0', color: '#f5834a', justifyContent: 'center' }} />
              </li>
            : null}
            {imageList.map((images, i) => (
              <GridListTile key={i}>
                <img src={images.imagePath.replace('=s220','')} alt={images.imageName} style={{ width: 'auto', maxWidth: '100%', height: 'auto', paddingBottom: '48px' }} />
                <GridListTileBar
                  className={classes.titleBar}
                  title={images.imageName}
                  actionIcon={
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(i)}
                      checked={checked.indexOf(i) !== -1}
                      className={classes.checkbox}
                      style={{ color: '#fff' }}
                    />
                  }
                />
              </GridListTile>
            ))}
          </GridList>
          }
        </div>

      </Dialog>
    </div>
  );
}