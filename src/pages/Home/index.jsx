import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import testIcon1 from '~/images/testIcons/1.png';
// import testIcon2 from '~/images/testIcons/2.png';
import testIcon3 from '~/images/testIcons/3.png';
import testIcon4 from '~/images/testIcons/4.png';
import testIcon5 from '~/images/testIcons/5.png';
import testIcon6 from '~/images/testIcons/6.png';
import testIcon7 from '~/images/testIcons/7.png';
import testIcon8 from '~/images/testIcons/8.png';
import testIcon9 from '~/images/testIcons/9.png';
import testIcon10 from '~/images/testIcons/10.png';
import Li from './Li';
import InformationLi from './InformationLi';

export default function 메인페이지 () {
  const theadList = useRef(["날짜", "시간", "검사"]);
  const icons = useMemo(() => ({
    testIcon1,
    testIcon3,
    testIcon4,
    testIcon5,
    testIcon6,
    testIcon7,
    testIcon8,
    testIcon9,
    testIcon10
  }), []);
  const [list, setList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [informationList, setInformationList] = useState([]);

  const getList = () => {
    useAxios.get('/myTestList').then(({ data }) => {
      if (!data?.result) {
        useAlert.error('검사 리스트', data?.msg);
        setDateList([]);
        setList([]);
        return;
      }

      let temp = [];
      data?.data && setList(data?.data);
      data?.data && data?.data?.forEach(li => {
        let date = li?.DATE?.split(' ')[0];
        li.ICON = icons["testIcon" + li?.TEST_ID] ?? null;
        temp.indexOf(date) === -1 && temp.push(date);
      });
      temp.sort((x, y) => {
        let _x = Number(x?.replaceAll('-', ''));
        let _y = Number(y?.replaceAll('-', ''));
        return _y - _x;
      });
      setDateList(temp);
      getInformationData();
    })
  }

  const getInformationData = () => {
    useAxios.get('/testInformation').then(({ data }) => {
      if (!data?.result) return useAlert.error('검사 개요', data?.msg);
      setInformationList(data?.data?.main);
    });
  }

  const getTestList = useCallback(date => (
    list?.filter(x => x?.DATE?.split(' ')[0] === date)
  ), [list]);
  
  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up'>
      <Title>검사 리스트</Title>

      <Table.Wrap>
        <Table.Thead>
          <Table.Tr>
            {theadList.current.length > 0 && theadList.current.map(item => (
              <th key={item}>{item}</th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {dateList.length === 0 && <NotLi><td colSpan={3}>검사 이력이 없습니다.</td></NotLi>}
          {dateList.length > 0 && dateList.map((date, i) => (
            <Li key={i} date={date} list={getTestList(date)} />
          ))}
        </Table.Tbody>
      </Table.Wrap>

      {/*  */}

      {informationList?.length > 0 && (<>
        <Title>검사 유형</Title>
        <TestList>
          <TestBody>
            {informationList?.map((item, i) => (
              <InformationLi key={item.ID} idx={i} item={item} />
            ))}
          </TestBody>
        </TestList>
      </>)}

    </PageAnimate>
  )
}

const Title = Styled.h2``;
const Table = {
  Wrap: Styled.table`
    margin-bottom: 50px;
  `,
  Thead: Styled.thead`
    th {
      letter-spacing: 3px;
      background-color: #f1f9f8;
      width: 100%;
      &:nth-of-type(1) {
        width: 110px;
      }
      &:nth-of-type(2) {
        width: 100px;
      }
    }
    @media screen and (min-width: 700px) {
      th:nth-of-type(1) {
        width: 180px;
      }
      th:nth-of-type(2) {
        width: 170px;
      }
    }
    @media screen and (max-width: 500px) {
      th:nth-of-type(1) {
        width: 110px;
      }
      th:nth-of-type(2) {
        display: none;
      }
    }
  `,
  Tr: Styled.tr``,
  Tbody: Styled.tbody``
};
const TestList = Styled.table``;
const TestBody = Styled.tbody``;
const NotLi = Styled.tr`
  border: 1px solid #ddd;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  color: #555;
`;