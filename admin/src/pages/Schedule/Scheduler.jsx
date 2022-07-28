import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  createContext,
  useRef,
} from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Loading from '@/pages/Common/Loading';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import useDate from '%/useDate';
import Header from './Header';
import Year from './Year';
import Month from './Month';
import Week from './Week';
import Day from './Day';
import Tooltip from './Tooltip';
import WriteScheduleModal from './WriteScheduleModal';
import ReservationModal from './ReservationModal';
import SettingModal from './SettingModal';

export const Store = createContext();

export default function 타입컨텐츠({ active, setActive, initData }) {
  const timeout = useRef(null);
  const startTime = useStore((x) => x?.setting?.START_TIME);
  const endTime = useStore((x) => x?.setting?.END_TIME);
  const timeRange = useStore((x) => x?.setting?.SCHEDULE_TIME_RANGE);
  const colorList = useStore((x) => x?.colorList);
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);
  const [writeInfo, setWriteInfo] = useState(null);
  const [isTooltip, setIsTooltip] = useState({
    bool: false,
    info: null,
  });
  const [isReservationModal, setIsReservationModal] = useState(null);
  const [isSettingModal, setIsSettingModal] = useState(false);

  const getSchedule = useCallback(() => {
    if (!active || !active?.start || !active?.end) return;

    useAxios.get('/schedule', { params: active }).then(({ data }) => {
      setIsLoad(false);
      if (!data?.result || !data?.data) return setList([]);
      setList(data?.data);
    });
  }, [active, setList]);

  const currentHourList = useMemo(() => {
    let tempArr = [];
    let start = Number(startTime?.split(':')[0] ?? 0);
    let end = Number(endTime?.split(':')[0] ?? 0);
    let calc = end - start;
    for (let i = start; i <= start + calc; i++) {
      tempArr.push(i < 10 ? '0' + i : i);
    }
    return tempArr?.map((t) => String(t));
  }, [startTime, endTime]);

  const createSchedule = () => {
    let today = new Date();
    today?.setHours(today?.getHours() + 1);
    today?.setMinutes(0);
    today?.setSeconds(0);
    today?.setMilliseconds(0);
    let START_TIME = useDate(today, 'time');
    today?.setMinutes(today?.getMinutes() + timeRange);
    let END_TIME = useDate(today, 'time');

    let findCalendar = initData?.calendar?.find(
      (x) => x?.ID === active?.calendar,
    );
    let CALENDAR_TYPE = findCalendar ? findCalendar?.TYPE : 0;

    setWriteInfo({
      CALENDAR_TYPE,
      START_TIME,
      END_TIME,
    });
  };

  useEffect(() => {
    let interval;
    clearInterval(interval);
    getSchedule();
    // interval = setInterval(getSchedule, 2000);
    // return () => clearInterval(interval);
  }, [active, initData?.calendar, initData?.room]);

  return (
    <Store.Provider
      value={{
        calendarList: initData?.calendar,
        roomList: initData?.room,
        teacherList: initData?.teacher,
        currentHourList,
        colorList,
        active,
        setActive,
        list,
        isTooltip,
        setIsTooltip,
        timeout,
        writeInfo,
        setWriteInfo,
        getSchedule,
      }}
    >
      <Container>
        <Wrap>
          <Header
            active={active}
            setActive={setActive}
            getSchedule={getSchedule}
            setIsSettingModal={setIsSettingModal}
          />
          <SchedulerContainer>
            {isLoad ? (
              <Loading />
            ) : (
              <>
                {active?.view === 1 && <Year />}
                {active?.view === 2 && <Month />}
                {active?.view === 3 && <Week />}
                {active?.view === 4 && <Day />}
                {isTooltip?.bool && (
                  <Tooltip
                    getSchedule={getSchedule}
                    setIsReservationModal={setIsReservationModal}
                  />
                )}
                {active?.calendar !== 0 && (
                  <CreateBtn onClick={createSchedule}>
                    <PlusIcon />
                  </CreateBtn>
                )}
                {writeInfo && (
                  <WriteScheduleModal
                    currentData={writeInfo}
                    setCurrentData={setWriteInfo}
                  />
                )}
              </>
            )}
          </SchedulerContainer>
        </Wrap>
      </Container>

      {isReservationModal && (
        <ReservationModal
          data={isReservationModal}
          setIsReservationModal={setIsReservationModal}
        />
      )}
      {isSettingModal && <SettingModal setIsSettingModal={setIsSettingModal} />}
    </Store.Provider>
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
