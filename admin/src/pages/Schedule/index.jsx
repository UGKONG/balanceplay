import React, { useState, useEffect, useRef, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useDate from '%/useDate';
import TypeList from './TypeList';
import TypeContents from './TypeContents';

export default function 스케줄 () {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  const dateDeps = useRef([
    {id: 1, name: '년' },
    {id: 2, name: '월' },
    {id: 3, name: '주' },
    {id: 4, name: '일' },
  ]);
  const [activeType, setActiveType] = useState(1);
  const [activeDetailType, setActiveDetailType] = useState(1);
  const [activeDateDeps, setActiveDateDeps] = useState(2);

  const dateInit = () => {
    if (date) return;
    setDate(useDate(new Date(), 'date'));
  }
  const getCalendar = () => {
    dateInit();
    if (!date || !calcDate?.start || !calcDate?.end) return setData(null);
    useAxios.get('/schedule?start=' + calcDate?.start + '&end=' + calcDate?.end).then(({ data }) => {
      if (!data?.result || !data?.data) return setData(null);
      setData(data?.data);
      console.log(data?.data);
    })
  }
  const calcDate = useMemo(() => {
    let id = activeDateDeps;
    let start = '2000-01-01';
    let end = '3000-01-01';
    if (dateDeps.current?.find(x => x?.id === id) === -1 || !date) return { start, end };
    let _date = new Date(date);
    switch (id) {
      case 1:
        _date = new Date(date);
        _date.setMonth(0);
        _date.setDate(1);
        start = useDate(_date, 'date');
        _date.setMonth(11);
        _date.setDate(31);
        break;
      case 2: 
        _date = new Date(date);
        _date.setDate(1);
        start = useDate(_date, 'date');
        _date.setMonth(_date.getMonth() + 1);
        _date.setDate(1);
        _date.setDate(_date.getDate() - 1);
        break;
      case 3: 
        _date = new Date(date);
        let day = _date.getDay();
        _date.setDate(_date.getDate() - day);
        start = useDate(_date, 'date');
        _date.setDate(_date.getDate() + 6);
        break;
      case 4: 
        _date = new Date(date);
        start = useDate(_date, 'date');
        break;
    }
    end = useDate(_date, 'date');
    return { start, end };
  }, [date, activeDateDeps]);

  useEffect(getCalendar, [date]);

  return (
    <PageAnimate name='slide-up' style={{ display: 'flex' }}>
      <TypeList 
        activeType={activeType} 
        activeDetailType={activeDetailType} 
        setActiveDetailType={setActiveDetailType} 
        setActiveType={setActiveType} 
        typeList={data?.type ?? []} 
        calendarList={data?.calendar}
      />
      <TypeContents 
        activeType={activeType} 
        activeDetailType={activeDetailType} 
        activeDateDeps={activeDateDeps} 
        scheduleList={data?.schedule}
      />
    </PageAnimate>
  )
}
