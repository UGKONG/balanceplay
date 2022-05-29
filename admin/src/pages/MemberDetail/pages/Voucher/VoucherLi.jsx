import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 보유이용권리스트 ({ data }) {

  return (
    <Wrap>
      <Category>{data?.CATEGORY_NAME}</Category>
      <Name>{data?.NAME}</Name>
    </Wrap>
  )
}

const Wrap = Styled.div`
  padding: 10px;
  flex: 1;
  min-width: 150px;
  max-width: 200px;
  box-shadow: 0px 3px 4px #00000020;
  border: 1px solid #c9ebe7;
  border-radius: 5px;
  margin: 5px;
  font-size: 13px;
  color: #333;
  display: block !important;
`;
const Category = Styled.p`
  font-size: 12px;
`;
const Name = Styled.p`

`;