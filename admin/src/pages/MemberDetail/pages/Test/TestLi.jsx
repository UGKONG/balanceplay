import React, { useRef } from 'react';
import Styled from 'styled-components';
import testIcon from '~/images/testIcons/1.svg';
import { useNavigate } from 'react-router-dom';
import testIcon1 from '~/images/testIcons/1.svg';
import testIcon3 from '~/images/testIcons/3.svg';
import testIcon4 from '~/images/testIcons/4.svg';
import testIcon5 from '~/images/testIcons/5.svg';
import testIcon6 from '~/images/testIcons/6.svg';
import testIcon7 from '~/images/testIcons/7.svg';
import testIcon8 from '~/images/testIcons/8.svg';
import testIcon9 from '~/images/testIcons/9.svg';
import testIcon10 from '~/images/testIcons/10.svg';

export default function 작성검사리스트({ data }) {
  const navigate = useNavigate();
  const testTypeId = data?.TEST_TYPE_ID;
  const icons = useRef({ testIcon1, testIcon3, testIcon4, testIcon5, testIcon6, testIcon7, testIcon8, testIcon9, testIcon10 })

  const click = () => {
    let id = data?.ID;
    navigate('/test/' + id);
  }

  return (
    <Container onClick={click}>
      <Title>
        <TitleImg src={icons.current['testIcon' + testTypeId]} />
        {data?.NAME}
      </Title>
      <Content>
        {data?.CREATE_ADMIN_NAME ? (
          <TestInfoText>진행자명 : {data?.CREATE_ADMIN_NAME}</TestInfoText>
        ): (
          <TestInfoText>회원진행</TestInfoText>
        )}
        <TestInfoText>진행일시 : {data?.CREATE_DATE}</TestInfoText>
      </Content>
    </Container>
  )
}

const Container = Styled.li`
  padding: 10px;
  flex: 1;
  min-width: 220px;
  max-width: 240px;
  height: 90px;
  box-shadow: 0px 3px 4px #00000020;
  border: 1px solid #c9ebe7;
  border-radius: 5px;
  margin: 5px;
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-flow: column;
  cursor: pointer;

  &:hover {
    background-color: #cccccc20;
    p {
      color: #000 !important;
    }
  }
`
const Title = Styled.section`
  font-size: 17px;
  font-weight: 700;
  width: 100%;
  color: #00ada9;
  display: flex;
  align-items: center;
`
const TitleImg = Styled.img`
  width: 20px;
  height: 20px;
  margin-right: 4px;
`
const Content = Styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const TestInfoText = Styled.p`
  color: #777;
  font-size: 12px;
  letter-spacing: 1px;
`