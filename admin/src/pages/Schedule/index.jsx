import React, { useState, useEffect } from 'react';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useDate from '%/useDate';
import useStore from '%/useStore';
import TabList from './TabList';
import Scheduler from './Scheduler';

export default function 스케줄() {
  const setting = useStore((x) => x?.setting);
  const [initData, setInitData] = useState({});
  const [settingData, setSettingData] = useState(null);

  const settingInit = () => {
    if (!setting) return;
    setSettingData((prev) => ({
      ...prev,
      tab: setting?.ACTIVE_TAB_ID ?? 1,
      calendar: setting?.ACTIVE_CALENDAR_ID ?? 0,
      room: setting?.ACTIVE_ROOM_ID ?? 0,
      teacher: setting?.ACTIVE_TEACHER_ID ?? 0,
      view: setting?.ACTIVE_VIEW_TYPE_ID ?? 1,
    }));
  };

  const dateInit = () => {
    if (!settingData?.view) return;
    let start = new Date();
    let end = new Date();

    // 년
    if (settingData?.view === 1) {
      start.setMonth(0);
      start.setDate(1);
      end.setMonth(11);
      end.setDate(31);
    }

    // 월
    if (settingData?.view === 2) {
      start.setDate(1);
      start.setMonth(start.getMonth() + 1);
      start.setDate(1);
      start.setDate(start.getDate() - 1);
      let date = start.getDate();
      start.setDate(1);
      end.setDate(date);
    }

    // 주
    if (settingData?.view === 3) {
      let day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setDate(end.getDate() + (6 - day));
    }

    setSettingData((prev) => ({ ...prev, start: useDate(start, 'date') }));
    setSettingData((prev) => ({ ...prev, end: useDate(end, 'date') }));
    if (settingData?.view === 0 || settingData?.view > 4)
      setSettingData((prev) => ({ ...prev, view: 4 }));
  };

  const getCalendarInit = () => {
    useAxios.get('/scheduleInit').then(({ data }) => {
      if (!data?.result || !data?.data) return setInitData(null);
      setInitData(data?.data);
    });
  };

  useEffect(getCalendarInit, [settingData?.tab]);
  useEffect(dateInit, [settingData?.view]);
  useEffect(settingInit, [setting]);

  if (!initData) return null;

  return (
    <PageAnimate name="slide-up" style={{ display: 'flex' }}>
      <TabList
        initData={initData}
        active={settingData}
        setActive={setSettingData}
        getCalendarInit={getCalendarInit}
      />

      <Scheduler
        initData={initData}
        active={settingData}
        setActive={setSettingData}
      />
    </PageAnimate>
  );
}
