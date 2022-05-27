import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import useCleanArray from '%/useCleanArray';
import { BsQuestionCircleFill } from 'react-icons/bs';
import TestResultLi from './TestResultLi';
import DescriptionModal from './DescriptionModal';

export default function 검사지 () {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const isLogin = useStore(x => x?.isLogin);
  const METHOD = location.state?.METHOD;
  const id = params?.id;
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState(null);
  
  // 데이터 조회
  const getData = () => {
    useAxios.get('/detailResult/' + id).then(({ data }) => {
      if (!data.result) return setData(null);
      setData(data?.data);
    });
  }
  // 데이터 날짜 별 분리
  const dataFilter = useMemo(() => {
    let _list = useCleanArray(data?.pointResult ?? [], 'ID', ['ID'])?.map(item => item?.ID);
    if (!data || !_list) return { pointData: [], commentData: [] };

    let result = _list.map(item => {
      let point = data?.pointResult?.filter(x => x?.ID === item);
      let comment = data?.commentResult?.filter(x => x?.ID === item);
      let date = point[0]?.DATE;

      return { id: item, date, point, comment };
    });
    
    return result;
  }, [data]);
  // 신규 검사 페이지 이동
  const newSurveyGo = () => {
    if (!isLogin?.TEST_FLAG) return useAlert.error('검사불가', '가입센터에 문의해주세요.');
    navigate('/survey/' + id + '/new/', { state: data?.info });
  }

  useEffect(getData, [id]);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <h2>
          <Title>
            { data?.info?.NAME }
            <DescriptionBtn onClick={() => setIsModal(!isModal)}>
              <BsQuestionCircleFill color='#008a87' />
            </DescriptionBtn>
          </Title>
          {(METHOD === 1 || METHOD === 3) && <button onClick={newSurveyGo}>신규 검사</button>}
        </h2>
        <Description>{data?.info?.DESCRIPTION ?? ''}</Description>
      </Header>

      <List>
        {dataFilter?.length === 0 && <NotLi>검사 결과가 없습니다.</NotLi>}
        {dataFilter?.length > 0 && dataFilter?.map((item, i) => (
          <TestResultLi key={i} idx={i} item={item} info={data?.info} />
        ))}
      </List>

      {isModal && <DescriptionModal
        data={{ main: data?.info?.DESCRIPTION, sub: data?.description }}
        setIsModal={setIsModal}
      />}
    </PageAnimate>
  )
}

const Header = Styled.header``;
const Title = Styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const DescriptionBtn = Styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 3px;
  border: none;
  margin-left: 4px;
  &:hover,
  &:active {
    background-color: transparent !important;
  }
  i, svg {
    font-size: 20px;
  }
`;
const Description = Styled.p`
  font-size: 12px;
  color: #888;
  margin-top: 10px;
`;
const List = Styled.ul`
  margin-top: 20px;
`;
const NotLi = Styled.li`
  font-size: 14px;
  color: #999;
  margin-top: 40px;
  text-align: center;
`;