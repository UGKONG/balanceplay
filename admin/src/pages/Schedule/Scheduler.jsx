import React, { useEffect, useState, useRef } from 'react';
import Styled from 'styled-components';
import Header from './Header';
import useAxios from '%/useAxios';

export default function 타입컨텐츠({ settingData, setActive }) {

  const [list, setList] = useState([]);

  const validate = () => {
    console.log('실행');
    let keys = Object?.keys(settingData) ?? [];
    for (let i = 0; i < keys.length; i ++) {
      let key = keys[i];
      if (settingData[key] === null) return;
    }
    getSchedule();
  }
  const getSchedule = () => {
    // console.log('설정값: ', settingData);
    useAxios.get('/schedule', { params: settingData }).then(({ data }) => {
      if (!data?.result || !data?.data) return setList([]);
      setList(data?.data);
    })
  }

  useEffect(validate, [settingData]);

  return (
    <Wrap>
      <Header
        active={{
          view: settingData?.view,
          start: settingData?.start,
          end: settingData?.end,
        }}
        setActive={setActive}
      />
      <SchedulerContainer>
        캘린더: {settingData?.calendar}<br />
        방: {settingData?.room}<br />
        선생님: {settingData?.teacher}<br />
        시작일: {settingData?.start}<br />
        종료일: {settingData?.end}<br />
        뷰타입: {settingData?.view}<br /><br />
        {JSON.stringify(list)}
      </SchedulerContainer>
    </Wrap>
  )
}

const Wrap = Styled.article`
  flex: 1;
  height: 100%;
  border: 2px solid #b9e1dc;
  border-radius: 10px;
  overflow: hidden;
`;
const SchedulerContainer = Styled.section`
  width: 100%;
  height: calc(100% - 35px);
`