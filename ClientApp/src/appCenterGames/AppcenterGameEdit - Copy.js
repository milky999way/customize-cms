import React from 'react';
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FileInput, FileField, ImageInput, ImageField, DateTimeInput, BooleanInput, NumberInput, ArrayInput, SimpleFormIterator, SelectInput, FormWithRedirect, SaveButton } from 'react-admin';
import { Typography, Box, Checkbox, Button, Toolbar, FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import RichTextInput from 'ra-input-rich-text';

const AppcenterGameEdit = (props) => (
  <Edit {...props}>
    <FormWithRedirect redirect="/appCenterGames"
      render={formProps => (
        <form>
          <Box p="1em 50em 0 1em">
            <FileInput source="files" label="G-admin 매칭하기" accept="application/pdf" placeholder={<p>불러오기</p>}>
              <FileField source="src" title="title" />
            </FileInput>
          </Box>
          <Box p="1em 50em 0 1em">
            <TextInput source="title" label="게임명" fullWidth />
          </Box>
          <Box p="1em 50em 0 1em">
            <ImageInput source="pictures" label="앱아이콘" accept="image/*" placeholder={<p>업로드</p>}>
              <ImageField source="src" title="title" />
            </ImageInput>
          </Box>
          <Box p="1em 50em 0 1em" display="flex">
            <Box style={{ width: '40%', marginRight: '10%', display: 'inline-block' }}>
              <DateInput source="launchingDate" label="런칭일" fullWidth />
            </Box>
            <Box style={{ display: 'inline-block' }}>
              <BooleanInput source="commentable" label="미런칭" />
            </Box>
          </Box>
          <Box p="1em 50em 0 1em">
            <Box style={{ width: '40%', marginRight: '10%', display: 'inline-block' }}>
              <DateInput source="updateDate" label="업데이트" fullWidth />
            </Box>
          </Box>
          <Box p="1em 50em 0 1em">
            <Box style={{ width: '40%', marginRight: '10%', display: 'inline-block' }}>
              <NumberInput source="nb_views" label="버전" fullWidth />
            </Box>
          </Box>
          <Box p="1em 50em 0 1em">
            <ArrayInput source="channel">
              <SimpleFormIterator>
                <SelectInput source="category" choices={[
                  { id: 'facebook', name: 'facebook' },
                  { id: 'twitter', name: 'twitter' },
                  { id: 'instagram', name: 'instagram' },
                  { id: 'naver_cafe', name: 'navercafe' },
                ]} />
                <TextInput source="url" />
              </SimpleFormIterator>
            </ArrayInput>
          </Box>
          <Box p="1em 50em 0 1em">
            <ArrayInput source="appstore">
              <SimpleFormIterator>
                <SelectInput source="category" choices={[
                  { id: 'facebook', name: 'Facebook' },
                  { id: 'twitter', name: 'Twitter' },
                  { id: 'instagram', name: 'Instagram' },
                  { id: 'naver_cafe', name: 'Naver cafe' },
                ]} />
                <SelectInput source="category" choices={[
                  { id: 'android', name: 'Android' },
                  { id: 'ios', name: 'iOS' },
                ]} />
                <TextInput source="url" />
              </SimpleFormIterator>
            </ArrayInput>
          </Box>
          <Box p="1em 50em 0 1em">
            <ArrayInput source="build">
              <SimpleFormIterator>
                <SelectInput source="category" choices={[
                  { id: 'android', name: 'Android' },
                  { id: 'ios', name: 'iOS' },
                ]} />
                <FileInput source="files" label="" accept="application/pdf" placeholder={<p>업로드</p>}>
                  <FileField source="src" title="title" />
                </FileInput>
              </SimpleFormIterator>
            </ArrayInput>
          </Box>
          <Box p="1em 50em 0 1em">
            <RichTextInput source="update_info" />
          </Box>
          <Box p="1em 50em 0 1em">
            <RichTextInput source="game_info" />
          </Box>
          <Box p="1em 50em 0 1em">
            <FormLabel component="legend">가이드</FormLabel>
            <RadioGroup row aria-label="gender" name="gender1">
              <FormControlLabel value="female" control={<Radio />} label="미사용" />
              <FormControlLabel value="male" control={<Radio />} label="사용" />
            </RadioGroup>
            <Button variant="contained" color="secondary">글쓰기</Button>
          </Box>
          <Box p="1em 50em 0 1em">
            <FormLabel component="legend">노출</FormLabel>
            <RadioGroup row aria-label="gender" name="gender1">
              <FormControlLabel value="female" control={<Radio />} label="즉시노출" />
              <FormControlLabel value="male" control={<Radio />} label="예약노출" />
            </RadioGroup>
            <DateTimeInput source="aaa_date" />
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

export default AppcenterGameEdit;