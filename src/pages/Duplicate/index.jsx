import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import { useParams } from 'react-router-dom';

export default function () {
  const params = useParams();
  console.log(params);
	return (
		<Wrap>
			<Title>이메일 중복</Title>
      {params?.email}

		</Wrap>
	)
}

const Wrap = Styled.main`
  
`;
const Title = Styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #008a87;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  flex-wrap: nowrap;
  padding-bottom: 20px;
`