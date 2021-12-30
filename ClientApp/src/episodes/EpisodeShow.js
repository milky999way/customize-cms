import React, { useState, useEffect } from 'react';
import { Show, FormWithRedirect, SaveButton, required, TextInput, RadioButtonGroupInput, NumberInput, ImageInput, useDataProvider, TopToolbar, ListButton, EditButton, DeleteButton } from 'react-admin';
import { Typography, Box, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
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



const EpisodeShowActions = ({ permissions, basePath, data, resource }) => (
  <TopToolbar>
    {/* <DeleteButton basePath={basePath} record={data} resource={resource} /> */}
    <ListButton basePath={basePath} record={data} />
    {permissions !== undefined && (permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Episode-Writer') > -1) ?
      <EditButton basePath={basePath} record={data} style={{ marginLeft: '30px' }} />
      : null
    }
  </TopToolbar>
);



const EpisodeShow = ({ permissions, ...props }) => {
  /* STYLES */
  const classes = useStyles();

  const dataProvider = useDataProvider();
  const [stateLang, setStateLang] = useState(true); // 초기 언어유무 세팅(loop 방지)
  const [stateLangField, setStateLangField] = useState([]); // 초기 언어필드 세팅
  const [stateLastSlide, setStatelastSlide] = useState(); // 초기 마지막 슬라이드 타입 세팅(state)

  // 언어필드 세팅
  useEffect(() => {
    if (stateLang) {
      // 초기 마지막 슬라이드 타입 세팅(game or banner)
      dataProvider.getOne('episodes', {id: props.id})
      .then(({ data }) => {
        setStatelastSlide(data.lastSlide);
      })
      // 언어필드 세팅
      fetch('/api/episodes/setLanguageField')
      .then(response => {
        return response.json();
      })
      .then(lang => {
        setStateLangField(lang);
      });
    }
    setStateLang(false);
  });

  // 마지막 슬라이드 타입 선택
  const handleOnChangeRadio = (value) => {
    setStatelastSlide(value);
  }
  let lastGameValue;
  let lastGameDisabled;
  let lastBannerValue;
  let lastBannerDisabled;
  if (stateLastSlide === 'game') {
    lastGameValue = '';
    lastGameDisabled = false;
    lastBannerValue = 'Not used';
    lastBannerDisabled = true;
  } else {
    lastGameValue = 'Not used';
    lastGameDisabled = true;
    lastBannerValue = '';
    lastBannerDisabled = false;
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
    <Show {...props} actions={<EpisodeShowActions permissions={permissions} />}>
      <FormWithRedirect redirect="/episodes"
        render={formProps => (
          <form>
            <Box p="1em">
              <Box display="flex" m="2em 0 4em" borderBottom={2}>
                <Box flex={2} p="1em">
                  <Typography variant="h6" gutterBottom>Common</Typography>
                  <NumberInput source="index" validate={[required()]} disabled={true} label="Index" />
                  <TextInput source="link" validate={[required()]} fullWidth disabled={true} label="Link" />
                  <TextInput source="epNum" validate={[required()]} fullWidth disabled={true} label="Ep num" />
                  <TextInput source="epIndex" validate={[required()]} fullWidth disabled={true} label="Ep index" />
                  <TextInput source="dataEvt" validate={[required()]} fullWidth disabled={true} label="Data evt" />
                  <NumberInput source="slides" validate={[required()]} fullWidth disabled={true} label="Slides" />
                  <RadioButtonGroupInput source="lastSlide" label="Last slide" onChange={handleOnChangeRadio} choices={[
                    { id: 'game', name: 'game' },
                    { id: 'banner', name: 'banner' },
                  ]} disabled={true} />
                </Box>
                <Box flex={2} p="3em 1em 1em 1em">
                  <ImageInput source="img" accept="image/*" multiple={true} label="" className={classes.imageInput}>
                    <PreviewImage source="src" />
                  </ImageInput>
                </Box>
              </Box>

              <Box display="flex">
                {stateLangField.map((languages, i) => {
                  // console.log(languages);
                  return (
                    <Box flex={languages.length} m="1em" key={i}>
                      <Typography variant="h6" gutterBottom>{languages.name}</Typography>
                      <ImageInput source={"languageItem["+i+"].img"} accept="image/*" multiple={true} label="" className={classes.imageInput}>
                        <PreviewImage source="src" />
                      </ImageInput>

                      <TextInput source={"languageItem[" + i + "].lang"} disabled={true} label="Language" />
                      <TextInput source={"languageItem[" + i + "].title"} validate={[required()]} disabled={true} label="Title" fullWidth />
                      <TextInput source={"languageItem[" + i + "].subtitle"} validate={[required()]} disabled={true} label="Subtitle" fullWidth />

                      {stateLastSlide === 'game' ?
                      <>
                          <TextInput source={"languageItem[" + i + "].lastSlideGameComment"} disabled={true} defaultValue={lastGameValue} validate={[required()]} label="Game commnet" fullWidth />
                          <TextInput source={"languageItem[" + i + "].lastSlideGameButton"} disabled={true} defaultValue={lastGameValue} validate={[required()]} label="Game button" fullWidth />
                          <TextInput source={"languageItem[" + i + "].lastSlideGameSubtext"} disabled={true} defaultValue={lastGameValue} validate={[required()]} label="Game subtext" fullWidth />
                      </>
                      :
                      <>
                          <TextInput source={"languageItem[" + i + "].lastSlideBannerComment"} disabled={true} defaultValue={lastBannerValue} validate={[required()]} label="Banner comment" fullWidth />
                          <TextInput source={"languageItem[" + i + "].lastSlideBannerButton"} disabled={true} defaultValue={lastBannerValue} validate={[required()]} label="Banner button" fullWidth />
                          <TextInput source={"languageItem[" + i + "].lastSlideBannerLink"} disabled={true} defaultValue={lastBannerValue} validate={[required()]} label="Banner link" fullWidth />
                      </>
                      }
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* <Toolbar>
              <Box display="flex" justifyContent="space-between" width="100%">
                <SaveButton
                  saving={formProps.saving}
                  handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                />
              </Box>
            </Toolbar> */}
          </form>
        )} />
    </Show>
  );
};

export default EpisodeShow;