import React from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;
  const srcImg = record.params['img'];
  return <Box>{srcImg ? <img src={srcImg} width="100px" /> : 'Изображение отсутствует'}</Box>;
};

export default Edit;
