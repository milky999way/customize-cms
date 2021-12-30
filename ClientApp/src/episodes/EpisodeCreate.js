import React, { useState, useEffect } from 'react';
import { Create, FormWithRedirect, TextInput, SaveButton, required, RadioButtonGroupInput, NumberInput, useRefresh } from 'react-admin';
import { Typography, Box, Toolbar } from '@material-ui/core';
import EpisodeImgFieldDialog from './EpisodeImgFieldDialog';



const EpisodeCreate = (props) => {
  const [stateLang, setStateLang] = useState(true); // 초기 언어유무 세팅(loop 방지)
  const [stateLangField, setStateLangField] = useState([]); // 초기 언어필드 세팅
  const [stateLastSlide, setStatelastSlide] = useState('game'); // 초기 마지막 슬라이드 타입 세팅(game or banner)
  const [stateImgUrl, setStateImgUrl] = useState([]);
  const [stateEnImgUrl, setStateEnImgUrl] = useState([]);
  const [stateJaImgUrl, setStateJaImgUrl] = useState([]);
  const [stateKoImgUrl, setStateKoImgUrl] = useState([]);

  // 언어필드 세팅
  useEffect(() => {
    if (stateLang) {
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



  return (
    <Create {...props}>
      <FormWithRedirect redirect="/episodes"
        initialValues={
          {
            img: stateImgUrl.map((url, i) => {
              return (
                { src: url }
              )
            }),
            lastSlide: stateLastSlide,
            languageItem: stateLangField.map((langs, i) => {
              return (
                {
                  img:
                  i === 0 ?
                    stateEnImgUrl.map((url) => {
                      return (
                        { src: url }
                      )
                    })
                  : i === 1 ?
                    stateJaImgUrl.map((url) => {
                      return (
                        { src: url }
                      )
                    })
                  : i === 2 ?
                    stateKoImgUrl.map((url) => {
                      return (
                        { src: url }
                      )
                    })
                  : null,
                  lang: langs.lang,
                  lastSlideGameComment: lastGameValue,
                  lastSlideGameSubtext: lastGameValue,
                  lastSlideGameButton: lastGameValue,
                  lastSlideBannerComment: lastBannerValue,
                  lastSlideBannerButton: lastBannerValue,
                  lastSlideBannerLink: lastBannerValue
                }
              )
            })
          }
        }
        render={formProps => (
          <form>
            <Box p="1em">
              <Box display="flex" m="2em 0 4em" borderBottom={2}>
                <Box flex={2} p="1em">
                  <Typography variant="h6" gutterBottom>Common</Typography>
                  <NumberInput source="index" validate={[required()]} label="Index" />
                  <TextInput source="link" validate={[required()]} label="Link" fullWidth />
                  <TextInput source="epNum" validate={[required()]} label="Ep num" fullWidth />
                  <TextInput source="epIndex" validate={[required()]} label="Ep index" fullWidth />
                  <TextInput source="dataEvt" validate={[required()]} label="Data evt" fullWidth />
                  <NumberInput source="slides" validate={[required()]} label="Slides" fullWidth />
                  <RadioButtonGroupInput source="lastSlide" label="Last slide" onChange={handleOnChangeRadio} choices={[
                    { id: 'game', name: 'game' },
                    { id: 'banner', name: 'banner' },
                  ]} />
                </Box>
                <Box flex={2} p="4em 1em 1em 1em">
                  <EpisodeImgFieldDialog
                    imgField="img"
                    fieldName="img"
                    stateImgUrl={stateImgUrl} 
                    setStateImgUrl={setStateImgUrl}
                    stateEnImgUrl={stateEnImgUrl}
                    setStateEnImgUrl={setStateEnImgUrl}
                    stateJaImgUrl={stateJaImgUrl}
                    setStateJaImgUrl={setStateJaImgUrl}
                    stateKoImgUrl={stateKoImgUrl}
                    setStateKoImgUrl={setStateKoImgUrl}
                    // record={formProps.record}
                  />
                  <div style={{ border: '1px dashed rgba(0, 0, 0, 0.42)', padding: '2rem 1rem' }}>
                    <ul style={{ color: 'rgba(0, 0, 0, 0.42)', margin: '0' }}>
                      <li style={{ margin: '10px 0' }}>icon.png, share.png, thumbnail.png에 해당하는 이미지는 반드시 선택해주세요.</li>
                      <li style={{ margin: '10px 0' }}>최종 슬라이드 형식에 맞는 이미지를 등록해주세요.<br />(ex - 게임형은 app_xxx.jpg 등, 배너형은 banner_XX.png 등에 해당하는 이미지)</li>
                    </ul>
                  </div>
                </Box>
              </Box>

              <Box display="flex">
                {stateLangField.map((languages, i) => {
                  // console.log(languages);
                  return (
                    <Box flex={languages.length} m="1em" key={i}>
                      <Typography variant="h6" gutterBottom>{languages.name}</Typography>
                      <EpisodeImgFieldDialog
                        imgField={"languageItem["+i+"].img"}
                        fieldName={languages.lang}
                        stateImgUrl={stateImgUrl} 
                        setStateImgUrl={setStateImgUrl}
                        stateEnImgUrl={stateEnImgUrl}
                        setStateEnImgUrl={setStateEnImgUrl}
                        stateJaImgUrl={stateJaImgUrl}
                        setStateJaImgUrl={setStateJaImgUrl}
                        stateKoImgUrl={stateKoImgUrl}
                        setStateKoImgUrl={setStateKoImgUrl}
                        // record={formProps.record}
                      />
                      <div style={{ border: '1px dashed rgba(0, 0, 0, 0.42)', padding: '1rem', marginBottom: '3rem' }}>
                        <ul style={{ color: 'rgba(0, 0, 0, 0.42)', margin: '0', paddingInlineStart: '20px' }}>
                          <li>
                            {i === 0 ? 'The episodes are displayed in the order of the image names.' : i === 1 ? '画像名の順にエピソードに表示されます。' : '이미지명의 순서로 에피소드에 표시됩니다. (001 ~)'}
                          </li>
                        </ul>
                      </div>

                      <TextInput source={"languageItem[" + i + "].lang"} disabled={true} label="Language" />
                      <TextInput source={"languageItem[" + i + "].title"} validate={[required()]} label="Title" fullWidth />
                      <TextInput source={"languageItem[" + i + "].subtitle"} validate={[required()]} label="Subtitle" fullWidth />
                      <TextInput source={"languageItem[" + i + "].lastSlideGameComment"} disabled={lastGameDisabled} defaultValue={lastGameValue} validate={[required()]} label="Game commnet" fullWidth />
                      <TextInput source={"languageItem[" + i + "].lastSlideGameButton"} disabled={lastGameDisabled} defaultValue={lastGameValue} validate={[required()]} label="Game button" fullWidth />
                      <TextInput source={"languageItem[" + i + "].lastSlideGameSubtext"} disabled={lastGameDisabled} defaultValue={lastGameValue} validate={[required()]} label="Game subtext" fullWidth />
                      <TextInput source={"languageItem[" + i + "].lastSlideBannerComment"} disabled={lastBannerDisabled} defaultValue={lastBannerValue} validate={[required()]} label="Banner comment" fullWidth />
                      <TextInput source={"languageItem[" + i + "].lastSlideBannerButton"} disabled={lastBannerDisabled} defaultValue={lastBannerValue} validate={[required()]} label="Banner button" fullWidth />
                      <TextInput source={"languageItem[" + i + "].lastSlideBannerLink"} disabled={lastBannerDisabled} defaultValue={lastBannerValue} validate={[required()]} label="Banner link" fullWidth />
                    </Box>
                  );
                })}
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
    </Create>
  );
};

export default EpisodeCreate;