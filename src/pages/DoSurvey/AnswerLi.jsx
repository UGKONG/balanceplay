import React, { useMemo } from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';
import { useParams } from 'react-router-dom';

export default function 답변 ({ categoryId, askId, item }) {
  if (!item) return null;
  
  const params = useParams();
  const dispatch = useStore(x => x.setState);
  const sendData = useStore(x => x.surveySendData);
  const testId = Number(params?.id ?? 0);

  const check = () => {
    let data = { TEST: testId, CATEGORY: categoryId, ASK: askId, ANSWER: item?.ID };
    let result = [...sendData].filter(x => x?.ASK !== askId);
    result.push(data);
    result.sort((x, y) => x?.ASK - y?.ASK);
    
    dispatch('surveySendData', result);
  }

  return (
    <Wrap>
      <RadioBtn 
        type='radio' 
        name={askId} 
        id={`${askId}_${item?.ID}`}
        // checked={checked}
        onChange={check}
      />
      <ItemText htmlFor={`${askId}_${item?.ID}`}>
        {item?.ANSWER}
      </ItemText>
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const RadioBtn = Styled.input`
  margin-right: 5px;
  &:checked + label {
    color: #000;
    font-weight: 500;
  }
`;
const ItemText = Styled.label`
  font-size: 14px;
  color: #555;
`;
