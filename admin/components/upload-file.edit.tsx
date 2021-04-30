import React from 'react';
import {
  Label,
  Box,
  DropZone,
  DropZoneProps,
  DropZoneItem,
} from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro/src/frontend/components/property-type/base-property-props';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props;
  const { page, category } = props.property.props;

  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange('filePath', `/uploads/${page}/${category}/` + files[0]?.name);
    onChange('fileName', files[0]?.name);
    onChange(property.name, files[0]);
  };

  const uploadedFile = record.params.files;

  const fileToUpload = record.params[property.name];

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone onChange={handleDropZoneChange} />
      {uploadedFile && !fileToUpload && <DropZoneItem src={uploadedFile} />}
    </Box>
  );
};

export default Edit;
