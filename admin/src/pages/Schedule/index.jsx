import React, { useState, useEffect } from 'react';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useDate from '%/useDate';
import useStore from '%/useStore';
import TabList from './TabList';
import Scheduler from './Scheduler';

export default function 스케줄() {
  const setting = useStore(x => x?.setting);
  const [initData, setInitData] = useState({});
  const [activeTab, setActiveTab] = useState(setting?.ACTIVE_TAB_ID ?? 1);
  const [activeCalendar, setActiveCalendar] = useState(setting?.ACTIVE_CALENDAR_ID ?? 0);
  const [activeRoom, setActiveRoom] = useState(setting?.ACTIVE_ROOM_ID ?? 0);
  const [activeTeacher, setActiveTeacher] = useState(setting?.ACTIVE_TEACHER_ID ?? 0);
  const [activeViewType, setActiveViewType] = useState(setting?.ACTIVE_VIEW_TYPE_ID ?? 3);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const dateInit = (startDT, endDT) => {
    let start = startDT ?? new Date();
    let end = endDT ?? new Date();

    // 년
    if (activeViewType === 1) {
      start.setMonth(0);
      start.setDate(1);
      end.setMonth(11);
      end.setDate(31);
    }

    // 월
    if (activeViewType === 2) {
      start.setDate(1);
      start.setMonth(start.getMonth() + 1);
      start.setDate(1);
      start.setDate(start.getDate() - 1);
      let date = start.getDate();
      start.setDate(1);
      end.setDate(date);
    }

    // 주
    if (activeViewType === 3) {
      let day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setDate(end.getDate() + (6 - day));
    }

    setStartDate(useDate(start, 'date'));
    setEndDate(useDate(end, 'date'));
    if (activeViewType === 0 || activeViewType > 4) setActiveViewType(4);
  }

  const getCalendarInit = () => {
    useAxios.get('/scheduleInit').then(({ data }) => {
      if (!data?.result || !data?.data) return setInitData(null);
      setInitData(data?.data);
    })
  }

  useEffect(getCalendarInit, [activeTab]);
  useEffect(dateInit, [activeViewType]);

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
          start: setStartDate,
          end: setEndDate,
        }}
      />
    </PageAnimate>
  )
}
