import React, { useState, useEffect, useCallback } from 'react';
import Styled from 'styled-components';
import { GiToolbox } from "react-icons/gi";
import CategoryLi from './CategoryLi';
import AskLi from './AskLi';

export default function 페이지 ({ categoryList, askList, answerList, pageStatusAction, activePageId, nextBtnClick }) {
  if (!categoryList || categoryList?.length === 0) return null;
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeAskList, setActiveAskList] = useState([]);
  
  // 카테고리 리스트 클릭
  const categoryClick = useCallback(item => {
    setActiveCategory(item);
    setActiveAskList(askList.filter(x => x.CATEGORY_ID === item?.ID));
  }, [askList]);
  // 해당 페이지에 카테고리가 1개이면 바로 질문 리스트를 보여준다.
  const categoryCheck = useCallback(() => {
    categoryList?.length === 1 && categoryClick(categoryList[0]);
  }, [categoryList, categoryClick]);
  // 다음 버튼 클릭 시 리셋
  const clickReset = useCallback(() => {
    setActiveCategory(null);
    setActiveAskList([]);
  }, []);

  useEffect(clickReset, [activePageId]);
  useEffect(categoryCheck, [activeCategory]);

  return (
    <Wrap>
      <CategoryName>
        <span dangerouslySetInnerHTML={{ 
          __html: activeCategory?.CATEGORY_NAME ?? '카테고리를 선택해주세요. <small style="white-space: nowrap;">(교구유무에 따라 택1)</small>' 
        }} />
        <small>({pageStatusAction?.status?.now}/{pageStatusAction?.status?.all})</small>
      </CategoryName>
      {activeCategory?.TOOL && (
        <CategoryTool>
          <GiToolbox style={{ marginRight: 4 }} />
          {activeCategory?.TOOL ?? '도구 이름'}
        </CategoryTool>
      )}
      {activeCategory?.TOOL_DESCRIPTION && (
        <CategoryDescription>
          {activeCategory?.TOOL_DESCRIPTION ?? '카테고리 설명'}
        </CategoryDescription>
      )}

      {!activeCategory && categoryList?.length > 0 && (
        <CategoryUl>
          {categoryList.map(item => (
            <CategoryLi 
              key={item?.ID}
              item={item} 
              categoryClick={categoryClick}
            />
          ))}
        </CategoryUl>
      )}

      {activeAskList?.length > 0 && (
        <AskUl>
          {activeAskList.map(item => (
            <AskLi
              key={item.ID}
              item={item}
              answerList={answerList}
            />
          ))}
        </AskUl>
      )}
      
      {activeCategory && (
        <NextCategoryBtn onClick={() => nextBtnClick({ activeCategory, activeAskList })}>
          {pageStatusAction?.text}
        </NextCategoryBtn>
      )}
    </Wrap>
  )
}

const Wrap = Styled.section``;
const CategoryName = Styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #008a87;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  flex-wrap: nowrap;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const CategoryTool = Styled.p`
  margin-top: 6px;
  font-size: 13px;
  color: #777;
  font-weight: 500;
`;
const CategoryDescription = Styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #777;
  margin-top: 2px;
`;
const CategoryUl = Styled.ul`
  margin-top: 10px;
`;
const AskUl = Styled.ul`
  margin-top: 10px;
`;
const NextCategoryBtn = Styled.button`
  margin-top: 20px;
  width: 100%;
`;