import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import TestLi from './TestLi';

import testIcon1 from '~/images/testIcons/1.svg';
// import testIcon2 from '~/images/testIcons/2.svg';
import testIcon3 from '~/images/testIcons/3.svg';
import testIcon4 from '~/images/testIcons/4.svg';
import testIcon5 from '~/images/testIcons/5.svg';
import testIcon6 from '~/images/testIcons/6.svg';
import testIcon7 from '~/images/testIcons/7.svg';
import testIcon8 from '~/images/testIcons/8.svg';
import testIcon9 from '~/images/testIcons/9.svg';
import testIcon10 from '~/images/testIcons/10.svg';

export default function () {
  const navigate = useNavigate();
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
      "testId": 1,
      "name": "영유아 운동 선별 검사",
      "children": [
        {
          "name": "",
          "result": 53,
          "resultText": "대근육 54~59개월 / 소근육 48~53개월"
        }
      ]
    },
    {
      "testId": 2,
      "name": "예측키",
      "children": [
        {
          "name": "키, 제중 백분율: 키: 90% 몸무게: 60%",
          "result": 60,
          "resultText": "185CM"
        }
      ]
    },
    {
      "testId": 3,
      "name": "유아 식습관 검사",
      "children": [
        {
          "name": "",
          "result": 34.8,
          "resultText": "34.8%"
        }
      ]
    },
    {
      "testId": 4,
      "type": 2,
      "name": "밸런스 기질 검사",
      "children": [
        {
          "name": "",
          "result": 75,
          "resultText": "75.0%"
        }
      ]
    },
    {
      "testId": 5,
      "type": 2,
      "name": "밸런스 감각 검사",
      "children": [
        {
          "name": "",
          "result": 80,
          "resultText": "80%"
        }
      ]
    },
    {
      "testId": 6,
      "type": 2,
      "name": "감각 운동 검사",
      "children": [
        {
          "name": "",
          "result": 60,
          "resultText": "60%"
        }
      ]
    },
    {
      "testId": 7,
      "type": 2,
      "name": "대근육 운동 이동 검사",
      "children": [
        {
          "name": "",
          "result": 50,
          "resultText": "5년 3개월"
        }
      ]
    },
    {
      "testId": 8,
      "type": 2,
      "name": "대근육 운동 조작 검사",
      "children": [
        {
          "name": "",
          "result": 50,
          "resultText": "3년 3개월"
        }
      ]
    },
    {
      "testId": 9,
      "type": 3,
      "name": "유아 정서 지능 검사",
      "children": [
        {
          "name": "자기 인식 표현 능력",
          "result": 100,
          "resultText": "100%"
        },
        {
          "name": "또래 관계능력",
          "result": 34.3,
          "resultText": "34.3%"
        }
      ]
    },
    {
      "testId": 10,
      "type": 3,
      "name": "양육 태도 검사",
      "children": [
        {
          "name": "애정적 태도",
          "result": 91.7,
          "resultText": "91.7%"
        },
        {
          "name": "자율적 태도",
          "result": 83.3,
          "resultText": "83.3%"
        }
      ]
    }
  ]);

  const getList = () => {
    useAxios.get('/totalResult').then(({ data }) => {
      if (!data.result) return setList([]);

      let temp = [];
      data?.data && data.data.forEach(li => {
        li.icon = icons['testIcon' + li.TEST_TP_SN];
        temp.push(li);
      });
      setList(temp);
    })
  }
  const backPage = () => navigate('/');

  useEffect(getList, []);

	return (
		<PageAnimate name='slide-up'>
      <h2>
        <span>종합 검사결과</span>
        <button className='btn' onClick={backPage}>뒤로가기</button>
      </h2>
			<List>
        {list.map((item, i) => (
          <TestLi key={i} item={item} />
        ))}
      </List>
		</PageAnimate>
	)
}

const List = Styled.ul`
  padding-top: 10px;
`