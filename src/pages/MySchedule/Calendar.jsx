import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';

export default function 달력 () {
  const [startDay, setStartDay] = useState(null);
  const [dateCount, setDateCount] = useState(null);
  
  const init = () => {

  }

  useEffect(init, []);
  
  if (!startDay || !dateCount) return null;
  return (
    <Wrap>

    </Wrap>
  )
}

const Wrap = Styled.article`
  width: 100%;
  height: auto;
  margin: 10px auto;
`;