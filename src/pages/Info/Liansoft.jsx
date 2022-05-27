import React, { useMemo } from 'react';
import Styled from 'styled-components';
import drcareunion from '~/images/liansoft/drcareunion.jpg';
import bodyscanner from '~/images/liansoft/bodyscanner.jpg';
import balanceplay from '~/images/liansoft/balanceplay.jpg';

export default function 리안소프트정보 ({ Style }) {
  const data = useMemo(() => [
    { title: '상호', contents: '(주)리안소프트글로벌', size: null },
    { title: '홈페이지', contents: '<a href="http://liansoft.co.kr" target="_blank">www.liansoft.co.kr</a>', size: null },
    { contents: '센서와 장비, IOT 기술을 아우르는 통합 기술을 바탕으로 하여 모든 사람의 건강을 책임지는 헬스케어 솔루션과 시스템을 만들어가고있습니다. 유년기부터 노년기까지의 사람의 일생을 아우르는 종합 건강관리 솔루션을 완성해 나가겠습니다.', size: 13 },
  ], []);

  const projectData = useMemo(() => [
    { title: '밸런스플레이', img: balanceplay, description: '영유아 / 청소년을 대상으로 각종 운동검사 / 기질검사 / 감각검사 등을 종합적으로 수행하고 결과에 대한 Feedback을 수행하는 프로그램입니다.' },
    { title: '바디스캐너', img: bodyscanner, description: '바디스캐너는 체형측정 및 ROM 측정을 통해 나의 몸 건강상태를 측정하는 장비입니다.' },
    { title: '닥터케어유니온', img: drcareunion, description: '필라테스 / 헬스장용 회원관리 기능 및 회원용 앱. 바디스캐너 / 인바디와 연동되어 종합건강 관리를 수행할 수 있는 프로그램입니다.' },
  ], [drcareunion])

  return (
    <Style.Wrap>
      
      {/* 정보 */}
      {data?.length > 0 && data?.map((item, i) => (
        <Style.Row key={i} margin={10}>
          {item?.title && <Style.SubTitle>{item?.title}</Style.SubTitle>}
          <Style.Contents
            style={{ fontSize: item?.size ?? 'auto' }}
            dangerouslySetInnerHTML={{ __html: item?.contents }}
          />
        </Style.Row>
      ))}

      {projectData?.length > 0 && (
        <ProjectWrap>
          <WrapTitle>개발 플랫폼</WrapTitle>
          {projectData?.map((item, i) => (
            <Project key={i}>
              <Title><Dot/> {item?.title}</Title>
              <Image src={item?.img} />
              <Description>{item?.description}</Description>
            </Project>
          ))}
        </ProjectWrap>
      )}

    </Style.Wrap>
  )
}

const ProjectWrap = Styled.div`
  margin-top: 40px;
  margin-bottom: 20px;
`;
const WrapTitle = Styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #008a87;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  &::after {
    content: '';
    display: block;
    flex: 1;
    width: 100%;
    height: 2px;
    background-color: #359b98;
    margin-left: 12px;
  }
`;
const Project = Styled.div`
  margin-bottom: 20px;
`;
const Title = Styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #029b64;
  padding-bottom: 6px;
  display: flex;
  align-items: center;
`;
const Image = Styled.img`
  width: 100%;
  max-width: 500px;
`;
const Description = Styled.p`
  font-size: 13px;
  color: #666;
  padding: 0 2px;
`;
const Dot = Styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #029b64;
  margin-right: 5px;
`;