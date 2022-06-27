import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 검사상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState({});
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const getData = () => {
    useAxios.get('/memberTestResult/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) return useAlert?.error('알림', data?.msg);
      console.log(data?.data);
      setData(data?.data);
    });
  }

  const deleteTest = () => {
    return useAlert.info('알림', '점검중입니다.');
    let ask = confirm('해당 검사결과를 삭제하시겠습니까?');
    if (!ask) return;

    useAxios.delete('/memberTestResult/' + id).then(({ data }) => {
      if (!data?.result) return useAlert?.error('알림', data?.msg);
      navigate(-1);
    })
  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>검사정보 상세보기 <s>측정일: {data?.testData?.CREATE_DATE}</s></Title>
        <span>
          {<DeleteBtn onClick={deleteTest}>검사정보 삭제</DeleteBtn>}
          <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
        </span>
      </Header>
      <Contents>
        <DescriptionContainer>
          {isDescriptionOpen && (
            <>
              <DescriptionLeft>
                <DescriptionName>{data?.testTypeData?.NAME ?? '-'}</DescriptionName>
                <DescriptionSubInfo>{data?.testTypeData?.METHOD_NAME}</DescriptionSubInfo>
              </DescriptionLeft>
              <DescriptionRight>
                {data?.testTypeData?.DESCRIPTION?.map(item => (
                  <CategoryLi key={item?.ID}>
                    <b>{item?.NAME}</b>
                    <span dangerouslySetInnerHTML={{ __html: item?.DESCRIPTION }} />
                  </CategoryLi>
                ))}
              </DescriptionRight>
            </>
          )}
          <p onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}>검사정보 {isDescriptionOpen ? '닫기' : '열기'}</p>
        </DescriptionContainer>
        <ResultContainer>
          {JSON.stringify(data?.testPointData)}
        </ResultContainer>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2`
  s {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
    margin-left: 6px;
  }
`;
const DeleteBtn = Styled.button`
  border: 1px solid #ff4f4f !important;
  background-color: #ee6d6d !important;
  &:hover {
    background-color: #ec6565 !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px rgb(238 109 109 / 25%) !important;
  }
`;
const BackBtn = Styled.button``;
const Contents = Styled.section`
  display: flex;
  flex-direction: column;
`;
const DescriptionContainer = Styled.div`
  border-radius: 8px;
  width: 100%;
  min-height: 40px;
  max-height: 200px;
  padding: 16px 16px 10px;
  margin-bottom: 10px;
  background-color: #b9e1dcaa;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start !important;
  position: relative;
  overflow: hidden;

  & > section {
    min-width: 200px;
    height: calc(100% - 40px);
  }
  & > p {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #a8d7d2;
    &:hover {
      background-color: #92c7c2;
      color: #fff;
    }
  }
`;
const DescriptionLeft = Styled.section`
  padding-right: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
`;
const DescriptionRight = Styled.section`
  padding-left: 5px;
  padding-right: 4px;
  width: calc(100% - 200px);
  overflow: auto;
`;
const DescriptionName = Styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #209b98;
`;
const DescriptionSubInfo = Styled.p`
  font-size: 14px;
  color: #555;
`;
const CategoryLi = Styled.article`
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
  & > b {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #888;
  }
  & > span {
    font-size: 13px;
    color: #999;
  }
`;
const ResultContainer = Styled.div`
  flex: 1;
  display: flex;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
`;
