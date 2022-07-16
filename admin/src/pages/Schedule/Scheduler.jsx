import React, { useEffect, useState, useCallback } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import Header from './Header';
import Year from './Year';
import Month from './Month';
import Week from './Week';
import Day from './Day';

export default function 타입컨텐츠({ settingData, setActive }) {

  const [list, setList] = useState([]);

  const getSchedule = () => {
    useAxios.get('/schedule', { params: settingData }).then(({ data }) => {
      if (!data?.result || !data?.data) return setList([]);
      setList(data?.data);
    })
  }

  useEffect(() => {
    let interval;
    clearInterval(interval);
    getSchedule();
    interval = setInterval(getSchedule, 2000);
    return () => clearInterval(interval);
  }, [settingData]);

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
        {settingData?.view === 1 && <Year set={settingData} data={list} />}
        {settingData?.view === 2 && <Month set={settingData} data={list} />}
        {settingData?.view === 3 && <Week set={settingData} data={list} />}
        {settingData?.view === 4 && <Day set={settingData} data={list} />}
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