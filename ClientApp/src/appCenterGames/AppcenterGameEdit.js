import React, { useState } from 'react';
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FileInput, FileField, ImageInput, ImageField, DateTimeInput, BooleanInput, NumberInput, ArrayInput, SimpleFormIterator, SelectInput, FormWithRedirect, SaveButton } from 'react-admin';
import { Typography, Box, Checkbox, Button, Toolbar, FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import RichTextInput from 'ra-input-rich-text';
import { makeStyles } from '@material-ui/core/styles';
import AppcenterGameDialog from './AppcenterGameDialog';



const useStyles = makeStyles((theme) => ({
  newBox: {
    '& > div > div': {
      padding: '1em',
      margin: '1em',
      backgroundColor: 'rgb(250, 250, 251)',
      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.12)',
    },
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
  uploadBox: {
    '& .RaFileInput-dropZone-53': {
      display: 'inline-block',
      padding: '0',
    },
    '& .RaFileInput-dropZone-53 > p': {
      margin: '0',
      padding: '6px 16px',
      borderRadius: '4px',
      backgroundColor: '#cee8d7',
      color: '#004b3e',
    },
  },
}));



const AppcenterGameEdit = ({ ...props }) => {
  /* STATES */
  const [callAppSource, setCallAppSource] = useState('');
  const [iconSource, setIconSource] = useState('');
  const [appSource, setAppSource] = useState('');

  /* STYLES */
  const classes = useStyles();

  /* FUNTIONAL COMPONENT */
  const PreviewImage = (props) => {
    let fileName = props.record.source.split('/').reverse()[0];
    return (
      <>
        <img src={props.record.source} alt="Image Preview" style={{ margin: '0.5rem', maxHeight: '10rem' }} />
        <p style={{ textAlign: 'center' }}>{fileName}</p>
      </>
    )
  };



  const handleIconUpload = (appIcon) => {
    if (appIcon !== null) {
      const formData = new FormData();
      formData.append('appIcon', appIcon);

      fetch('/api/appcenterGames/uploadS3AppIcon', {
        method: 'POST',
        body: formData
      }).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        setIconSource(data.icon);
      });
    } else {
      setIconSource('');
    }
  }


  const handleAppUpload = (appBuild) => {
    if (appBuild !== null) {
      const formData = new FormData();
      formData.append('appBuild', appBuild);

      fetch('/api/appcenterGames/uploadS3AppBuild', {
        method: 'POST',
        body: formData
      }).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        setAppSource(data.app);
      });
    } else {
      setAppSource('');
    }
  }



  return (
    <Edit {...props}>
      <FormWithRedirect redirect="/appCenterGames"
        initialValues={
          {
            app: {
              source: callAppSource
            },
            icon: {
              source: iconSource
            },
            build: [{
              app: {
                source: appSource
              },
            }]
          }
        }

        render={formProps => (
          <form>
            <Box p="1em" className={classes.newBox}>
              <Box display="flex">
                <Box flex={2}>
                  <NumberInput source="index" style={{ width: '50%' }} label="등록순서" />
                </Box>
                <Box flex={2}>
                  <AppcenterGameDialog
                    callAppSource="app.source"
                    setCallAppSource={setCallAppSource}
                  />
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <TextInput source="name" style={{ width: '50%' }} label="게임명" />
                </Box>
                <Box flex={2} className={classes.uploadBox}>
                  <ImageInput source="icon2" label="" accept="image/*" placeholder={<p>업로드</p>} onChange={handleIconUpload} label="앱아이콘">
                    <ImageField source="source2" />
                  </ImageInput>
                  <TextInput source="icon.source" style={{ width: '100%' }} label="업로드된 경로(S3)" />
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <BooleanInput source="launching.enable" style={{ display: 'inline-block' }} label="미런칭" />
                  <div><DateInput source="launching.date" label="런칭일" /></div>
                </Box>
                <Box flex={2}>
                  <DateInput source="updateDate" label="업데이트" />
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <TextInput source="version" label="버전" />
                </Box>
                <Box flex={2}>
                  <ArrayInput source="channel" label="채널등록">
                    <SimpleFormIterator>
                      <SelectInput source="category" choices={[
                        { id: 'facebook', name: 'facebook' },
                        { id: 'twitter', name: 'twitter' },
                        { id: 'instagram', name: 'instagram' },
                        { id: 'naver_cafe', name: 'navercafe' },
                      ]} label="채널" />
                      <TextInput source="url" label="주소" />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <ArrayInput source="market" label="앱스토어">
                    <SimpleFormIterator>
                      <SelectInput source="locale" style={{ width: '5%' }} choices={[
                        { id: 'en', name: 'en' },
                        { id: 'ja', name: 'ja' },
                        { id: 'ko', name: 'ko' },
                      ]} label="국가" />
                      <SelectInput source="os" label="" style={{ width: '5%' }} choices={[
                        { id: 'Android', name: 'Android' },
                        { id: 'iOS', name: 'iOS' },
                        { id: 'etc', name: 'etc' },
                      ]} label="운영체제" />
                      <TextInput source="link" label="주소" />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Box>
                <Box flex={2} className={classes.uploadBox}>
                  <ArrayInput source="build">
                    <SimpleFormIterator>
                      <SelectInput source="os" style={{ width: '5%' }} choices={[
                        { id: 'Android', name: 'Android' },
                        { id: 'iOS', name: 'iOS' },
                        { id: 'etc', name: 'etc' },
                      ]} label="운영체제" />
                      <FileInput source="app2" placeholder={<p>업로드</p>} onChange={handleAppUpload} label="앱빌드">
                        <FileField source="source2" title="title" />
                      </FileInput>
                      <TextInput source="app.source" style={{ width: '100%' }} label="업로드된 경로(S3)" />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <RichTextInput source="updateInfo" label="업데이트 정보" />
                </Box>
                <Box flex={2}>
                  <RichTextInput source="gameInfo" label="게임소개" />
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <BooleanInput source="guide.used" style={{ display: 'inline-block' }} label="가이드 사용" />
                  <RichTextInput source="guide.appGuide" label="가이드" />
                </Box>
                <Box flex={2}>
                  <BooleanInput source="display.reserved" style={{ display: 'inline-block' }} label="예약노출" />
                  <div><DateTimeInput source="display.reservedDate" label="예약일시" /></div>
                </Box>
              </Box>
            </Box>

            <Toolbar>
              <Box display="flex" justifyContent="space-between" width="100%">
                <SaveButton
                  saving={formProps.saving}
                  handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                />
              </Box>
            </Toolbar>
          </form>
        )} />
    </Edit>
  )
};

export default AppcenterGameEdit;