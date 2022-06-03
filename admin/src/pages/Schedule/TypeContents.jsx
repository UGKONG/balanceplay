import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';

export default function 타입컨텐츠 ({ activeType, activeDetailType, activeDateDeps, scheduleList }) {

  const [list, setList] = useState([]);

  const getList = () => {

  }

  useEffect(getList, [activeType, activeDetailType, activeDateDeps]);

  return (
    <Wrap>
      Contents <br />
      타입: {activeType} <br />
      디테일 타입: {activeDetailType} <br />
      날짜 뷰: {activeDateDeps} <br />
    </Wrap>
  )
}

const Wrap = Styled.article`
  flex: 1;
  height: 100%;
  border: 2px solid #b9e1dc;
  border-radius: 10px;
`;