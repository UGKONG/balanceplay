import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import TestLi from './TestLi';

export default function 검사데이터 () {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params?.id;
  if (!userId) {
    navigate('/member');
    return null;
  }
  const [testList, setTestList] = useState([]);
  const [list, setList] = useState([]);
  const [activeTest, setActiveTest] = useState(null);

  const getList = () => {
    useAxios.get('/memberTest/' + userId).then(({ data }) => {
      if (!data?.result || !data?.data) return useAlert?.error(data?.msg);
      const { test, list } = data?.data;
      setTestList(test);
      setList(list);
    })
  }
  
  const fastTest = e => {
    let val = e?.target?.value;
    if (val === '') return;
    navigate('/test/' + userId + '/new/', { state: { testTypeId: val } });
  }

  const activeMethod = useMemo(() => (
    testList?.find(x => x?.ID === activeTest)
  ), [testList, activeTest]);

  const testFilterList = useMemo(() => {
    if (!activeTest) return list;
    return list?.filter(x => x?.TEST_TYPE_ID === activeTest);
  }, [list, activeTest]);

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Left>
          <TestTypeList onChange={e => setActiveTest(Number(e.target.value))}>
            <option value=''>검사 종류 선택</option>
            {testList?.length > 0 && testList?.map(item => (
              <option key={item?.ID} value={item?.ID}>{item?.NAME}{item?.METHOD_ID === 2 && ' (선생님)'}</option>
            ))}
          </TestTypeList>
          {activeTest > 0 && <TestMethodText>{activeMethod?.METHOD_TEXT ?? ''}</TestMethodText>}
        </Left>
        {activeMethod?.METHOD_ID === 2 ? (
          <NewTestBtn onClick={() => navigate('/test/' + userId + '/new/', { state: { testTypeId: activeTest } })}>신규 검사</NewTestBtn>
        ) : (
          <FastTestBtn onChange={fastTest}>
            <option value=''>빠른 신규 검사</option>
            {testList?.length > 0 && testList?.filter(x => x?.METHOD_ID === 2)?.map(item => (
              <option key={item?.ID} value={item?.ID}>{item?.NAME}</option>
            ))}
          </FastTestBtn>
        )}
      </Header>
      <TestList>
        {testFilterList?.length === 0 && <NotLi>검사 리스트가 없습니다.</NotLi>}
        {testFilterList?.map(item => <TestLi key={item?.ID} data={item} />)}
      </TestList>
    </PageAnimate>
  )
}

const Header = Styled.div`
  height: 44px;
  padding: 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Left = Styled.span`

`
const TestList = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  width: 100%;
  height: calc(100% - 44px);
  overflow: auto;
  align-content: flex-start;
`;
const TestMethodText = Styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: #888;
`
const FastTestBtn = Styled.select`
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  border: 1px solid #00ada9;
  border-radius: 3px;
  background-color: #00ada9;
  padding: 0 12px;
  height: 32px;
  line-height: 30px;
  cursor: pointer;
`
const NotLi = Styled.li`
  color: #888;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const TestTypeList = Styled.select`
  min-width: 100px;
  height: 32px;
`;
const NewTestBtn = Styled.button`

`;