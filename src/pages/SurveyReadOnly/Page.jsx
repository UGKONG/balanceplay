import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import { GiToolbox } from "react-icons/gi";
import CategoryLi from './CategoryLi';
import AskLi from './AskLi';

export default function 페이지 ({ 
  pageId, categoryList, askList, answerList, pageRef,
  pageStatusAction, activePageId, setActivePageId 
}) {
  
  if (!categoryList || categoryList?.length === 0) return null;
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeAskList, setActiveAskList] = useState([]);
  
  // 카테고리 리스트 클릭
  const categoryClick = useCallback(item => {
    setActiveCategory(item);
    setActiveAskList(askList.filter(x => x.CATEGORY_ID === item?.ID));
  }, [askList]);
  // 해당 페이지에 카테고리가 1개이면 바로 질문 리스트를 보여준다.
  const categoryCheck = useCallback(() => {
    let temp = [...categoryList]?.find(x => x?.ID === pageId);
    // console.log(categoryList, pageId);
    categoryClick(temp);
  }, [categoryList, categoryClick]);

  const btnClick = num => {
    let pageTarget = pageRef.current;
    pageTarget.scrollTop = 0;
    setActivePageId(activePageId + num);
  }

  useEffect(categoryCheck, [pageId]);

  const activePrevCategoryBtn = useMemo(() => pageStatusAction?.now > 1, [pageStatusAction]);
  const activeNextCategoryBtn = useMemo(() => pageStatusAction?.now !== pageStatusAction?.all, [pageStatusAction]);
  const activeCloseCategoryBtn = useMemo(() => pageStatusAction?.now === pageStatusAction?.all, [pageStatusAction]);

  return (
    <Wrap>
      <CategoryName>
        <span>{activeCategory?.CATEGORY_NAME}</span>
        <small>({pageStatusAction?.now}/{pageStatusAction?.all})</small>
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
        <BtnWrap>
          {activePrevCategoryBtn && (
            <PrevCategoryBtn onClick={() => btnClick(-1)}>
              이 전
            </PrevCategoryBtn>
          )}
          {activeNextCategoryBtn && (
            <NextCategoryBtn className={
              activePrevCategoryBtn ? 'group' : ''
            } onClick={() => btnClick(1)}>
              다 음
            </NextCategoryBtn>
          )}
          {activeCloseCategoryBtn && (
            <CloseCategoryBtn onClick={() => navigate(-1)}>
              닫 기
            </CloseCategoryBtn>
          )}
        </BtnWrap>
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
const BtnWrap = Styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PrevCategoryBtn = Styled.button`
  width: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 1px solid #eee;
`;
const NextCategoryBtn = Styled.button`
  width: 100%;
  &.group {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
const CloseCategoryBtn = Styled.button`
  width: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background-color: #108b88;
  &:hover {
    background-color: #0d7978 !important;
  }
`;