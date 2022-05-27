import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Styled from 'styled-components';
import Chart from './Chart';

export default function ({ item }) {
  const [isFold, setIsFold] = useState(true);

  const totalPercent = useMemo(() => {
    if (item?.POINT?.length === 0) return { original: 0, normal: 0 };
    let total = 0;
    let now = 0;
    item?.POINT?.forEach(x => {
      total += x.MAX_POINT;
      now += x.POINT;
    });
    let original = now / total * 100;
    let normal = Math.round(original);
    return { original, normal };
  }, [item]);

  const totalComment = useMemo(() => {
    if (item?.COMMENT?.length === 0) return '';
    let total = '';
    item?.COMMENT?.forEach(x => {
      total += (' - ' + x.TOTAL_COMMENT + '<br />');
    });
    return total;
  }, [item]);

  const chartData = useMemo(() => ({
    labels: item?.POINT?.map(x => x?.CATEGORY_NAME),
    datasets: [{
      data: item?.POINT?.map(x => x?.POINT),
      backgroundColor: '#00ada950',
      borderColor: '#00ada990',
      borderWidth: 1,
    }]
  }), [item]);

  const lastMaxPoint = useMemo(() => {
    let temp = [...item?.POINT];
    temp?.sort((x, y) => x - y);
    return temp[temp.length - 1]?.MAX_POINT;
  }, [item]);

  return (
    <Wrap>
      <Header>
        {item?.ICON && <Icon src={item.ICON} alt='아이콘' />}
        {item?.NAME && <Title>{item?.NAME ?? '-'}</Title>}
        {item?.COMMENT?.length > 0 && <Date>
          (검사날짜: {item?.COMMENT[0]?.DATE})
        </Date>}
      </Header>
      <FoldBox>
        <Section>
          <SubTitle>
            검사결과
            <Percent>{totalPercent?.normal ?? 0}%</Percent>
          </SubTitle>
          <Progress percent={totalPercent?.original ?? 0} />
        </Section>

        {!isFold && <Section>
          <SubTitle>상세정보</SubTitle>
          <Chart data={chartData} max={lastMaxPoint} />
          <TotalComment dangerouslySetInnerHTML={{ __html: totalComment }} />
        </Section>}

        <FoldBtn onClick={() => setIsFold(prev => !prev)}>
          상세정보 {isFold ? '열기' : '닫기'}
        </FoldBtn>
      </FoldBox>
    </Wrap>
  )
}

const Header = Styled.h3`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 700;
  color: #00ada9;
  margin-bottom: 10px;
`;
const Date = Styled.small`
  margin-left: 6px;
  font-size: 13px;
  font-weight: 500; 
  flex: 1;
  text-align: right;
`;
const Icon = Styled.img`
  margin-right: 4px;
  height: 22px;
`;
const Title = Styled.span``;
const FoldBox = Styled.article`
  margin-bottom: 20px;
  padding: 15px 0 0;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px 2px #44444420;
`;
const Section = Styled.section`
  padding: 5px 14px 16px;
`;
const SubTitle = Styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Percent = Styled.span``;
const Progress = Styled.div`
  background-color: #eee;
  border-radius: 30px;
  border: 3px solid #eee;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    background-color: #74c2b9;
    width: ${x => x.percent}%;
    height: 10px;
    border-radius: 30px;
  }
`;
const TotalComment = Styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #008a87;
  line-height: 24px;
`;
const FoldBtn = Styled.button`
  display: block;
  width: 100%;
  height: 34px;
  border-radius: 0;
  box-shadow: none !important;
  margin: 0;
`;


const Wrap = Styled.li`
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0;
  }

  & > div {

    h4 {
      [result] {
        font-size: 15px;
        font-weight: 500;
        color: #74c2b9;
      }
    }
    [description] {
      font-size: 15px;
      margin-top: 6px;
      margin-bottom: 20px;
    }
    [child-contents] {
      padding-top: 10px;
    }
  }
`