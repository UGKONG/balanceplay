import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import Li from './Li';
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

export default function Home() {
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
  const [list, setList] = useState([
    {
      "id": 1,
      "date": "2022-04-01 14:00:20",
      "testId": 1,
      "testType": 1,
      "testName": "영유아 운동 선별 검사"
    },
    {
      "id": 2,
      "date": "2022-04-10 16:00:20",
      "testId": 4,
      "testType": 2,
      "testName": "밸런스 기질 검사"
    },
    {
      "id": 3,
      "date": "2022-04-22 22:22:22",
      "testId": 5,
      "testType": 2,
      "testName": "밸런스 감각 검사"
    },
    {
      "id": 4,
      "date": "2022-04-22 20:20:20",
      "testId": 6,
      "testType": 2,
      "testName": "감각 운동 검사"
    }
  ]);
  const [dateList, setDateList] = useState([]);

  const getList = () => {
    // API.get('/myTestList').then(({ data }) => {
      let temp = [];
      list && list?.forEach(li => {
        let date = li?.date?.split(' ')[0];
        li.icon = icons["testIcon" + li?.testId];
        dateList.indexOf(date) == -1 && temp.push(date);
      });
      setDateList(temp);
    // })
  }

  const getTestList = useCallback(date => (
    list?.filter(x => x?.date?.split(' ')[0] == date)
  ), [list]);
  
  useEffect(getList, []);


  return (
    <PageAnimate name='slide-up'>
      <Header>
        <h2>검사 리스트</h2>
        <div option></div>
      </Header>

      <Table>
        <thead>
          <tr>
            {theadList.current && theadList.current.map(
              item => <th key={item}>{item}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {dateList && dateList.map((item, i) => (
            <Li key={i} item={item} list={getTestList(item)} />
          ))}
        </tbody>
      </Table>
    </PageAnimate>
  )
}

const Header = Styled.header`
  overflow: auto;
  padding: 0 4px;
  h2 {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 10px;
    float: left;
    color: #008a87;
  }
`;
const Table = Styled.table`
  th {
    letter-spacing: 3px;
    background-color: #f1f9f8;
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
`