import React from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';

export default function 확인창({ data }) {
  if (data === null) return null;
  const dispatch = useStore((x) => x?.setState);

  const close = () => {
    dispatch('confirmInfo', null);
  };
  const yesClick = () => {
    data?.yesFn();
    close();
  };

  return (
    <All>
      <Background onClick={close} />
      <Container>
        <Title
          dangerouslySetInnerHTML={{ __html: data?.mainTitle ?? '제목' }}
        />
        <SubTitle
          dangerouslySetInnerHTML={{ __html: data?.subTitle ?? '서브제목' }}
        />
        <BtnContainer>
          <YesBtn onClick={yesClick}>확인</YesBtn>
          <NoBtn onClick={close}>취소</NoBtn>
        </BtnContainer>
      </Container>
    </All>
  );
}

const All = Styled.article``;
const Background = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000040;
  z-index: 50000;
`;
const Container = Styled.article`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  border-radius: 6px;
  box-shadow: 2px 3px 5px #00000060;
  z-index: 50001;
  min-width: 310px;
  width: 28%;
  background-color: #efefef;
`;
const Title = Styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding-top: 6px;
  position: relative;
`;
const SubTitle = Styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #ff0000;
  margin-top: 10px;
`;
const BtnContainer = Styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
`;
const Btn = Styled.div`
  padding: 5px 16px;
  font-size: 13px;
  margin-left: 8px;
  border-radius: 3px;
  cursor: pointer;
`;
const YesBtn = Styled(Btn)`
  border: 1px solid #f13535;
  background-color: #e85656;
  color: #fff;
  &:hover {
    background-color: #f13535;
  }
`;
const NoBtn = Styled(Btn)`
  border: 1px solid #777777;
  color: #444;
  &:hover {
    background-color: #eee;
    color: #222;
  }
`;
