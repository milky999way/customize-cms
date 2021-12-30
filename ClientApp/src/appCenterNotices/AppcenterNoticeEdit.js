import React from 'react';
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FileInput, FileField, ImageInput, ImageField, DateTimeInput, BooleanInput, NumberInput, ArrayInput, SimpleFormIterator, SelectInput, FormWithRedirect, SaveButton } from 'react-admin';
import { Typography, Box, Checkbox, Button, Toolbar, FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import RichTextInput from 'ra-input-rich-text';

const AppcenterNoticeEdit = (props) => (
  <Edit {...props}>
    <FormWithRedirect redirect="/appCenterGames"
      render={formProps => (
        <form>
          <Box p="1em 50em 0 1em">
            <TextInput source="author" label="작성자" fullWidth />
          </Box>
          <Box p="1em 50em 0 1em">
            <SelectInput source="category" choices={[
              { id: 'notice', name: '공지' },
              { id: 'event', name: '이벤트' },
            ]} />
          </Box>
          <Box p="1em 50em 0 1em">
            <TextInput source="title" label="제목" fullWidth />
          </Box>
          <Box p="1em 50em 0 1em">
            <FormLabel component="legend">노출</FormLabel>
            <RadioGroup row aria-label="gender" name="gender1">
              <FormControlLabel value="female" control={<Radio />} label="즉시노출" />
              <FormControlLabel value="male" control={<Radio />} label="예약노출" />
            </RadioGroup>
            <DateTimeInput source="aaa_date" />
          </Box>
          <Box p="1em 50em 0 1em">
            <RichTextInput source="contents" label="내용" />
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
);

export default AppcenterNoticeEdit;