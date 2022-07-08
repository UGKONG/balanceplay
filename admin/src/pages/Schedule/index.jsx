import React, { useState, useEffect, useRef, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useDate from '%/useDate';
import useStore from '%/useStore';
import TabList from './TabList';
import Scheduler from './Scheduler';

export default function 스케줄() {
  const setting = useStore(x => x?.setting);
  const [initData, setInitData] = useState({});
  const viewType = setting?.ACTIVE_VIEW_TYPE_ID ?? 4;

  const [activeTab, setActiveTab] = useState(setting?.ACTIVE_TAB_ID ?? 1);
  const [activeCalendar, setActiveCalendar] = useState(setting?.ACTIVE_CALENDAR_ID ?? 0);
  const [activeRoom, setActiveRoom] = useState(setting?.ACTIVE_ROOM_ID ?? 0);
  const [activeTeacher, setActiveTeacher] = useState(setting?.ACTIVE_TEACHER_ID ?? 0);
  const [activeViewType, setActiveViewType] = useState(viewType);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const dateInit = data => {
    let start = new Date();
    let end = new Date();

    // 년
    if (activeViewType === 1) {

      return;
    }

    // 월
    if (activeViewType === 2) {

      return;
    }

    // 주
    if (activeViewType === 3) {

      return;
    }

    let now = useDate(undefined, 'date');
    setStartDate(now);
    setEndDate(now);
    setActiveViewType(4);
  }

  const getCalendarInit = () => {
    useAxios.get('/scheduleInit').then(({ data }) => {
      if (!data?.result || !data?.data) return setInitData(null);
      setInitData(data?.data);
      console.log(data?.data);
    })
  }

  useEffect(getCalendarInit, [activeTab]);
  useEffect(() => dateInit(initData), [activeViewType]);

  if (!initData) return null;

  return (
    <PageAnimate name='slide-up' style={{ display: 'flex' }}>
      <TabList
        initData={initData}
        active={{
          tab: activeTab,
          calendar: activeCalendar,
          room: activeRoom,
          teacher: activeTeacher,
          view: activeViewType,
        }}
        setActive={{
          tab: setActiveTab,
          calendar: setActiveCalendar,
          room: setActiveRoom,
          teacher: setActiveTeacher,
          view: setActiveViewType,
        }}
      />
      <Scheduler
        initData={initData}
        settingData={{
          calendar: activeCalendar,
          room: activeRoom,
          teacher: activeTeacher,
          view: activeViewType,
          start: startDate,
          end: endDate,
        }}
        setActive={{
          view: setActiveViewType,
        }}
      />
    </PageAnimate>
  )
}
