import React from 'react';
import { Show, FormWithRedirect, TextInput, FileInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator, TopToolbar, ListButton, EditButton, ImageInput, DateInput, BooleanInput, DateTimeInput, FileField } from 'react-admin';
import { Typography, Box, Toolbar } from '@material-ui/core';
import RichTextInput from 'ra-input-rich-text';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  newBox: {
    '& > div > div': {
      padding: '1em',
      margin: '1em',
      backgroundColor: 'rgb(250, 250, 251)',
      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.12)',
    },
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


const AppcenterGameShow = ({ ...props }) => {
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
  return (
    <Show {...props}>
      <FormWithRedirect redirect="/appCenterGames"
        render={formProps => (
          <form>

            <Box p="1em" className={classes.newBox}>
              <Box display="flex">
                <Box flex={2}>
                  <NumberInput source="index" disabled={true} style={{ width: '50%' }} />
                </Box>
                <Box flex={2}>
                  <TextInput source="app.source" disabled={true} style={{ width: '50%' }} />
                  {/*<FileInput source="app" label="앱빌드 파일">*/}
                  {/*  <FileField source="source" />*/}
                  {/*</FileInput>*/}
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <TextInput source="name" disabled={true} style={{ width: '50%' }} />
                </Box>
                <Box flex={2}>
                  <ImageInput source="icon" accept="image/*" label="" className={classes.imageInput}>
                    <PreviewImage source="source" />
                  </ImageInput>
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <BooleanInput source="launching.enable" disabled={true} />
                  <DateInput source="launching.date" disabled={true} />
                </Box>
                <Box flex={2}>
                  <DateInput source="updateDate" disabled={true} />
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <TextInput source="version" disabled={true} />
                </Box>
                <Box flex={2}>
                  <ArrayInput source="channel">
                    <SimpleFormIterator disableAdd disableRemove>
                      <SelectInput source="sns" label="" style={{ width: '5%' }} disabled={true} choices={[
                        { id: 'facebook', name: 'facebook' },
                        { id: 'twitter', name: 'twitter' },
                        { id: 'instagram', name: 'instagram' },
                        { id: 'naver_cafe', name: 'naver_cafe' },
                      ]} />
                      <TextInput source="link" disabled={true} />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <ArrayInput source="market">
                    <SimpleFormIterator disableAdd disableRemove>
                      <SelectInput source="locale" label="" style={{ width: '5%' }} disabled={true} choices={[
                        { id: 'en', name: 'en' },
                        { id: 'ja', name: 'ja' },
                        { id: 'ko', name: 'ko' },
                      ]} />
                      <SelectInput source="os" label="" style={{ width: '5%' }} disabled={true} choices={[
                        { id: 'Android', name: 'Android' },
                        { id: 'iOS', name: 'iOS' },
                        { id: 'etc', name: 'etc' },
                      ]} />
                      <TextInput source="link" disabled={true} />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Box>
                <Box flex={2}>
                  <ArrayInput source="build">
                    <SimpleFormIterator disableAdd disableRemove>
                      <SelectInput source="os" label="" style={{ width: '5%' }} disabled={true} choices={[
                        { id: 'Android', name: 'Android' },
                        { id: 'iOS', name: 'iOS' },
                        { id: 'etc', name: 'etc' },
                      ]} />
                      <TextInput source="appBuild" disabled={true} />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <RichTextInput source="updateInfo" />
                </Box>
                <Box flex={2}>
                  <RichTextInput source="gameInfo" />
                </Box>
              </Box>
              <Box display="flex">
                <Box flex={2}>
                  <BooleanInput source="guide.used" disabled={true} />
                  <RichTextInput source="guide.appGuide" disabled={true} />
                </Box>
                <Box flex={2}>
                  <BooleanInput source="display.reserved" disabled={true} />
                  <DateTimeInput source="display.reservedDate" disabled={true} />
                </Box>
              </Box>
            </Box>








          </form>
        )}
      />
    </Show>
  )
};
    


export default AppcenterGameShow;