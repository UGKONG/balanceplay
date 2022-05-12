import React, { useMemo } from 'react';
import Styled from 'styled-components';
import AnswerLi from './AnswerLi';

export default function 질문 ({ item, answerList }) {
  if (!item) return null;
  const categoryId = item?.CATEGORY_ID;
  const askId = item?.ID;

  const filterAnswerList = useMemo(() => {
    return answerList.filter(x => x.ITEM_GROUP === item?.ITEM_GROUP);
  }, []);

  return (
    <Wrap>
      <AskTitle>{item?.ORDER}. {item?.ASK}</AskTitle>
      {filterAnswerList.length > 0 && <AnswerList>
        {filterAnswerList.map(item => (
          <AnswerLi key={item?.ID} categoryId={categoryId} askId={askId} item={item} />
        ))}
      </AnswerList>}
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 20px;
`;
const AskTitle = Styled.h5`
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
`;
const AnswerList = Styled.ul`
  
`;