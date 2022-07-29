import React from 'react';
import Styled from 'styled-components';
import loadImage from '~/images/load.gif';

export default function 로딩애니메이션() {
  if (!loadImage) return null;

  return (
    <Container>
      <Circle img={loadImage} />
    </Container>
  );
}

const Container = Styled.li`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Circle = Styled.div`
  width: 100px;
  height: 100px;
  min-width: 100px;
  max-width: 100px;
  min-height: 100px;
  max-height: 100px;
  border-radius: 50%;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(${(x) => x?.img});
`;
