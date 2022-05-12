import React from 'react';
import Styled from 'styled-components';

export default function 코멘트리스트 ({ item }) {

  return (
    <Wrap>
      <Name>{item?.CATEGORY_NAME ?? '카테고리 이름'}</Name>
      {item?.COMMENT && <Comment>{item?.COMMENT}</Comment>}
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 14px;
`;
const Name = Styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #0e7a79;
  margin-bottom: 6px;
`;
const Comment = Styled.p`
  font-size: 13px;
  color: #555;
`;