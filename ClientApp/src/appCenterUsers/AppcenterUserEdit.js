import React from 'react';
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FileInput, FileField, ImageInput, ImageField, DateTimeInput, BooleanInput, NumberInput, ArrayInput, SimpleFormIterator, SelectInput, FormWithRedirect, SaveButton } from 'react-admin';
import { Typography, Box, Checkbox, Button, Toolbar, FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import RichTextInput from 'ra-input-rich-text';

const AppcenterUserEdit = (props) => (
  <Edit {...props}>
    <FormWithRedirect redirect="/appCenterGames"
      render={formProps => (
        <form>
          <Box p="1em 50em 0 1em">
            <SelectInput source="category" choices={[
              { id: 'authority1', name: '권한1' },
              { id: 'authority2', name: '권한2' },
            ]} />
          </Box>
          <Box p="1em 50em 0 1em">
            <SelectInput source="category" choices={[
              { id: 'team1', name: '포코팡팀' },
              { id: 'team2', name: '포코포코팀' },
            ]} />
          </Box>
          <Box p="1em 50em 0 1em">
            <TextInput source="nickname" label="닉네임" fullWidth />
          </Box>
          <Box p="1em 50em 0 1em">
            <TextInput source="email" label="계정" fullWidth />
          </Box>
          <Box p="1em 50em 0 1em">
            <FormControlLabel control={<Checkbox name="checkedC" />} label="보안동의" />
          </Box>
          <Box p="1em 50em 0 1em">
            <DateInput source="visitDate" label="방문일" />
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

export default AppcenterUserEdit;