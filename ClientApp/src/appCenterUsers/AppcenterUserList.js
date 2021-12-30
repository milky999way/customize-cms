import React from 'react';
import { List, Datagrid, TextField, FileField, DateField, NumberField, BooleanInput, SimpleForm, TextInput, Filter, DatagridBody } from 'react-admin';


const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />
  </Filter>
);


const AppcenterUserList = (props) => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <FileField source="icon" title="icon" />
      <TextField source="title" />
      <DateField source="updateDate" />
    </Datagrid>
  </List>
);

export default AppcenterUserList;