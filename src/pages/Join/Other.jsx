import React, { useRef, useState } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';
import Checkbox from '%/Checkbox';

export default function ({ id, title, allCount, next, setTotalData }) {
  const [data, setData] = useState({ isOther: false, contents: '' });
  const placeholder = useRef('아이의 운동발달, 정서발달 및 약복용 등을 자유롭게 작성해주세요.');

  const validator = () => {
    setTotalData(prev => {
      let temp = {...prev};
      temp.other = data;
      return temp;
    });
    next();
  }
  const checkboxChange = value => {
    let temp = {...data};
    temp.isOther = value;
    setData(temp);
  }
  const textChange = e => {
    let value = e.target.value;
    let temp = {...data};
    temp.contents = value;
    setData(temp);
  }

  return (
    <>
      <h2>{title} ({id}/{allCount})</h2>
      <Row>
        <p>발달사항 진단여부</p>
        <Checkbox checked={data.isOther} onChange={checkboxChange} />
      </Row>
      <Textarea placeholder={placeholder.current} onChange={textChange} />
      <Row>
        <NextBtn onClick={validator}>다음</NextBtn>
      </Row>
    </>
  )
}

const Row = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  p {
    font-size: 14px;
    font-weight: 500;
    color: #282828;
    letter-spacing: 1px;
    display: block;
  }
`;
const Textarea = Styled.textarea`
  width: 100%;
  margin-bottom: 20px;
`;
const NextBtn = Styled.button`
  width: 100%;
  margin: 0;
`;