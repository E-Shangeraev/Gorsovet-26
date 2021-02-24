import React from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;
  const srcImg = record.params['fraction'];
  return <Box>{srcImg ? <img src={srcImg} width="70px" /> : 'Изображение отсутствует'}</Box>;
};

export default Edit;
