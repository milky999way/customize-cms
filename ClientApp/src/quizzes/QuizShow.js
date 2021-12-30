import React from 'react';
import { Show, FormWithRedirect, TextInput, NumberInput, SelectInput, ArrayInput, SimpleFormIterator, TopToolbar, ListButton, EditButton, ImageInput } from 'react-admin';
import { Typography, Box, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  answerList: {
    '& ul li': {
      borderBottom: '0',
      padding: '0'
    },
  },
  imageInput : {
    '& > div > div': {
      display: 'none',
    },
    '& > div > .previews': {
      display: 'block',
    },
    '& > div > .previews > div > button': {
      display: 'none',
    },
  },
}));


const QuizShowActions = ({ permissions, basePath, data, resource }) => (
  <TopToolbar>
    {/* <DeleteButton basePath={basePath} record={data} resource={resource} /> */}
    <ListButton basePath={basePath} record={data} />
    {permissions !== undefined && (permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1) ?
      <EditButton basePath={basePath} record={data} style={{ marginLeft: '30px' }} />
      : null
    }
  </TopToolbar>
);


const QuizShow = ({ permissions, ...props }) => {
  /* STYLES */
  const classes = useStyles();
  /* FUNTIONAL COMPONENT */
  const PreviewImage = (props) => {
    console.log(props);
    let fileName = props.record.src.split('/').reverse()[0];
    return (
      <>
        <img src={props.record.src} alt="Image Preview" style={{ margin: '0.5rem', maxHeight: '10rem' }} />
        <p style={{ textAlign: 'center' }}>{fileName}</p>
      </>
    )
  };

  return (
    <Show {...props} actions={<QuizShowActions permissions={permissions} />}>
      <FormWithRedirect redirect="/quizzes"
        render={formProps => (
          <form>
            <Box p="1em">
              <Box>
                <NumberInput source="index" style={{ width: '5%' }} disabled={true} />
              </Box>
              <Box>
                <TextInput source="title" style={{ width: '33%' }} disabled={true} />
              </Box>
              <Box>
                <ImageInput source="img" accept="image/*" multiple={true} label="" className={classes.imageInput}>
                  <PreviewImage source="src" />
                </ImageInput>
              </Box>

              <Box>
                <ArrayInput source="chapter">
                  <SimpleFormIterator disableAdd disableRemove>
                    <SelectInput source="type" label="Type" style={{ width: '5%' }} disabled={true} choices={[
                      { id: 'preference', name: 'Preference' },
                      { id: 'extroversion', name: 'E/I' },
                      { id: 'sensing', name: 'S/N' },
                      { id: 'thinking', name: 'T/F' },
                      { id: 'judging', name: 'J/P' },
                    ]} />
                    <TextInput source="question" label="Question" style={{ width: '50%' }} disabled={true} />
                    {/* <ImageInput source="img" accept="image/*" multiple={true} label="" className={classes.imageInput}>
                      <PreviewImage source="src" />
                    </ImageInput> */}
                    <ArrayInput source="answers" label="Answers" className={classes.answerList}>
                      <SimpleFormIterator disableAdd disableRemove>
                        <TextInput source="answer" label="Answer" style={{ width: '51%' }} disabled={true} />
                      </SimpleFormIterator>
                    </ArrayInput>
                  </SimpleFormIterator>
                </ArrayInput>
              </Box>
            </Box>
          </form>
        )}
      />
    </Show>
  )
};

export default QuizShow;