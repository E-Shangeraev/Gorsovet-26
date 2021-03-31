import React from 'react';
import { Label, Box, DropZone, DropZoneProps, DropZoneItem } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro/src/frontend/components/property-type/base-property-props';
// import { v4 as uuidv4 } from 'uuid';
// import crypto from 'crypto';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props;
  const fileName = new Date().getTime().toString();

  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange('img', '/uploads/' + files[0]?.name);
    // onChange('img', '/uploads/' + `${fileName}.${files[0]?.name.split('.')[1]}`);
    onChange(property.name, files[0]);
  };

  const uploadedPhoto = record.params.img;

  console.log(property.name);

  const photoToUpload = record.params[property.name];

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone onChange={handleDropZoneChange} />
      {uploadedPhoto && !photoToUpload && <DropZoneItem src={uploadedPhoto} />}
    </Box>
  );
};

export default Edit;
