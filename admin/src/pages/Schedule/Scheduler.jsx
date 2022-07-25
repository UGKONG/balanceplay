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
import Header from './Header';
import Year from './Year';
import Month from './Month';
import Week from './Week';
import Day from './Day';
import Tooltip from './Tooltip';

export const Store = createContext();

export default function 타입컨텐츠({ active, setActive }) {
  const timeout = useRef(null);
  const startTime = useStore((x) => x?.setting?.START_TIME);
  const endTime = useStore((x) => x?.setting?.END_TIME);
  const colorList = useStore((x) => x?.colorList);
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);
  const [isTooltip, setIsTooltip] = useState({
    bool: false,
    info: null,
  });

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

  useEffect(() => {
    let interval;
    clearInterval(interval);
    getSchedule();
    // interval = setInterval(getSchedule, 2000);
    // return () => clearInterval(interval);
  }, [active]);

  return (
    <Store.Provider
      value={{
        currentHourList,
        colorList,
        active,
        list,
        isTooltip,
        setIsTooltip,
        timeout,
      }}
    >
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
                {active?.view === 1 && <Year />}
                {active?.view === 2 && <Month />}
                {active?.view === 3 && <Week />}
                {active?.view === 4 && <Day />}
                {isTooltip?.bool && <Tooltip getSchedule={getSchedule} />}
              </>
            )}
          </SchedulerContainer>
        </Wrap>
      </Container>
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
