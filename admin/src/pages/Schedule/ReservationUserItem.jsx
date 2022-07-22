import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useStore from '%/useStore';
import useAxios from '%/useAxios';

export default function 예약회원_아이템({ data }) {
  return (
    <Container>
      {data?.USER_NAME} / {data?.STATUS}
      <StatusBtns>
        <Button>O</Button>
        <Button>X</Button>
        <Button>?</Button>
      </StatusBtns>
    </Container>
  );
}

const Container = Styled.article`
  padding: 6px 4px;
  color: #555;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #ffffff30;
    color: #000;
  }
`;
const StatusBtns = Styled.section`
  
`;
const Button = Styled.button`
  
`;
