import React from 'react';
import { Label, Box, DropZone } from 'admin-bro';

const Edit = () => {
  return (
    <Box>
      <Label>Загрузите изображение</Label>
      <DropZone onChange={(files) => console.log(files)} />
    </Box>
  );
};

export default Edit;
