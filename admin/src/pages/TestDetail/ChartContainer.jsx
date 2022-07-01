import React from 'react';
import Styled from 'styled-components';

export default function 결과차트 ({ width, data }) {


  return (
    <Container style={{ width }}>
      차트 영역
    </Container>
  )
}

const Container = Styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  border: 1px solid #aaa;
  border-radius: 10px;
`