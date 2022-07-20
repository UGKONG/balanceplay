import React, { useEffect, useState, useCallback } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import Header from './Header';
import Year from './Year';
import Month from './Month';
import Week from './Week';
import Day from './Day';
import Loading from '@/pages/Common/Loading';

export default function 타입컨텐츠({ active, setActive }) {
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);

  const getSchedule = useCallback(() => {
    if (!active || !active?.start || !active?.end) return;

    useAxios.get('/schedule', { params: active }).then(({ data }) => {
      console.log('불러옴..');
      setIsLoad(false);
      if (!data?.result || !data?.data) return setList([]);
      setList(data?.data);
    });
  }, [active, setList]);

  useEffect(() => {
    let interval;
    clearInterval(interval);
    getSchedule();
    // interval = setInterval(getSchedule, 2000);
    // return () => clearInterval(interval);
  }, [active]);

  return (
    <Container>
      <Wrap>
        <Header
          active={active}
          setActive={setActive}
          getSchedule={getSchedule}
        />
        <SchedulerContainer>
          {isLoad ? (
            <Loading />
          ) : (
            <>
              {active?.view === 1 && <Year set={active} data={list} />}
              {active?.view === 2 && <Month set={active} data={list} />}
              {active?.view === 3 && <Week set={active} data={list} />}
              {active?.view === 4 && <Day set={active} data={list} />}
            </>
          )}
        </SchedulerContainer>
      </Wrap>
    </Container>
  );
}

const Container = Styled.article`
  flex: 1;
  height: 100%;
  padding-left: 20px;
  overflow: hidden;
`;
const Wrap = Styled.article`
  border: 2px solid #b9e1dc;
  border-radius: 10px;
  height: 100%;
  overflow-x: unset;
  overflow-y: hidden;
`;
const SchedulerContainer = Styled.section`
  width: 100%;
  height: calc(100% - 35px);
  position: relative;
`;
const CreateBtn = Styled.button`
  width: 50px;
  height: 50px;
  position: absolute;
  z-index: 2;
  border-radius: 50%;
  box-shadow: 0 2px 4px #00000020;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PlusIcon = Styled(AiOutlinePlus)`
  font-size: 26px;
  font-weight: 900;
  color: #fff;
`;
