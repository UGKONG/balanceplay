import React from 'react';
import Styled from 'styled-components';
import { FaUserCircle } from "react-icons/fa";
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 로그인정보 () {
  const isLogin = useStore(x => x.isLogin);

  return (
    <Wrap>
      {isLogin?.IMAGE_PATH ? (
        <Image img={isLogin?.IMAGE_PATH} />
      ) : (
        <NotImage />
      )}
      <Name>{isLogin?.NAME}</Name>
    </Wrap>
  )
}

const imgSize = `
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  max-width: 48px;
  max-height: 48px;
  border-radius: 100px;
`;
const Wrap = Styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  height: 100%;
  cursor: pointer;
  padding: 0 10px;
`;
const Image = Styled.div`
  ${imgSize}
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center;
  background-image: url(${x => x.img});
  border: 1px solid #008a87;
`;
const NotImage = Styled(FaUserCircle)`
  ${imgSize}
  color: #fff;
  background-color: #008a87;
`;
const Name = Styled.p`
  flex: 1;
  font-size: 13px;
  color: #008a87;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;