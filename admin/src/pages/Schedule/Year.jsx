import React, { useRef } from "react";
import Styled from "styled-components";

export default function 년 ({ set, data }) {

  const yearList = useRef(new Array(12).fill(null));

  return (
    <Container>
      {yearList?.current?.map((d, i) => (
        <YearBox key={i}>
          <YearTitle>{i + 1}월</YearTitle>
          <ScheduleList>
            {data?.filter(x => Number(x?.START?.split('-')[1]) === i + 1)?.map(item => (
              <ScheduleItem key={item?.ID}>{item.TITLE}</ScheduleItem>
            ))}
          </ScheduleList>
        </YearBox>
      ))}
    </Container>
  )
}

const Container = Styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`
const YearBox = Styled.div`
  min-width: calc(100% / 6);
  height: 50%;
  flex: 1;
  border-bottom: 1px solid #b9e1dc99;
  display: block !important;
  &:nth-of-type(6) ~ & {
    border-bottom: none;
  }
  &:nth-of-type(6), &:nth-of-type(12) {
     & > p, & > ul {
       border-right: none;
     }
  }
`
const YearTitle = Styled.p`
  height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background-color: #b9e1dc99;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #fff;
`
const ScheduleList = Styled.ul`
  border-right: 1px solid #b9e1dc99;
  height: calc(100% - 30px);
  padding: 6px;
  overflow: auto;
`
const ScheduleItem = Styled.li`
  color: #fff;
  font-size: 12px;
  padding: 6px;
  margin-bottom: 6px;
  border-radius: 3px;
  background-color: #519a92;
  box-shadow: 1px 2px 4px #55555520;
`