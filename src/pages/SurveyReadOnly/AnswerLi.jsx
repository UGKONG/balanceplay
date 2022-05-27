import React, { useMemo } from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';
import { useParams } from 'react-router-dom';

export default function 답변 ({ categoryId, askId, item }) {
  if (!item) return null;
  const sendData = useStore(x => x.surveySendData);

  const checked = useMemo(() => {
    let find = sendData.filter(x => x?.ASK === askId && x?.ANSWER === item?.ID);
    let result = find?.length > 0 ? true : false;
    return result;
  }, [sendData]);

  return (
    <Wrap>
      <RadioBtn 
        type='radio' 
        name={askId} 
        id={`${askId}_${item?.ID}`}
        checked={checked}
        disabled={true}
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
    text-decoration: underline;
  }
`;
const ItemText = Styled.label`
  font-size: 14px;
  color: #555;
`;
