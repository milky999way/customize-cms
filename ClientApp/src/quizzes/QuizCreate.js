import React, { useState, useEffect } from 'react';
import { Create, FormWithRedirect, TextInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator, SaveButton, required } from 'react-admin';
import { Typography, Box, Toolbar } from '@material-ui/core';
import QuizImgFieldDialog from './QuizImgFieldDialog';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  answerList: {
    '& ul li': {
      borderBottom: '0',
      padding: '0'
    },
  },
});


const QuizCreate = (props) => {
  const classes = useStyles();
  const [stateImgUrl, setStateImgUrl] = useState([]);
  return (
    <Create {...props}>
      <FormWithRedirect redirect="/quizzes"
        initialValues={
          {
            img: stateImgUrl.map((url, i) => {
              return (
                { src: url }
              )
            })
          }
        }
        render={formProps => (
          <form>
            <Box p="1em">
              <Box>
                <NumberInput source="index" style={{ width: '5%' }} />
              </Box>
              <Box>
                <TextInput source="title" style={{ width: '33%' }} />
              </Box>
              <Box borderBottom={1}>
                <QuizImgFieldDialog
                  imgField="img"
                  fieldName="img"
                  stateImgUrl={stateImgUrl}
                  setStateImgUrl={setStateImgUrl}
                  // stateEnImgUrl={stateEnImgUrl}
                  // setStateEnImgUrl={setStateEnImgUrl}
                  // stateJaImgUrl={stateJaImgUrl}
                  // setStateJaImgUrl={setStateJaImgUrl}
                  // stateKoImgUrl={stateKoImgUrl}
                  // setStateKoImgUrl={setStateKoImgUrl}
                />
                {/* <p>* Q1.gif, Q2.gif...(문항수와 동일하게) 선택해주세요.</p> */}
              </Box>

              <Box style={{ paddingTop: '5rem' }}>
                <p style={{ color: 'red' }}>★ MBTI(E/I, S/N, T/F, J/P)에 해당하는 문항과 취향(Preference) 문항을 최소 1개 이상씩 선택해주세요.</p>
                <ArrayInput source="chapter">
                  <SimpleFormIterator>
                    <SelectInput source="type" label="Type" style={{ width: '5%' }} choices={[
                      { id: 'preference', name: 'Preference' },
                      { id: 'extroversion', name: 'E/I' },
                      { id: 'sensing', name: 'S/N' },
                      { id: 'thinking', name: 'T/F' },
                      { id: 'judging', name: 'J/P' },
                    ]} />
                    <TextInput source="question" label="Question" style={{ width: '52%' }} />
                    {/* <QuizImgFieldDialog
                      imgField="chapter[0].img"
                      fieldName="chapter[0].img"
                      stateImgUrl={stateImgUrl}
                      setStateImgUrl={setStateImgUrl}
                    /> */}
                    <ArrayInput source="answers" label="Answers" className={classes.answerList} defaultValue={[{ answer: ""}, { answer: ""}, { answer: ""}, { answer: ""}]}>
                      <SimpleFormIterator disableAdd disableRemove>
                        <TextInput source="answer" label="Answer" style={{ width: '51%' }} />
                      </SimpleFormIterator>
                    </ArrayInput>
                  </SimpleFormIterator>
                </ArrayInput>
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
        )}
      />
    </Create>
  )
};

export default QuizCreate;