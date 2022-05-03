import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import { BsQuestionCircleFill } from 'react-icons/bs';
import DetailSurveyLi from './DetailSurveyLi';
import DescriptionModal from './DescriptionModal';

export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const itemData = location.state;
  const id = params?.id;
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState(null);
  
  const getData = () => {
    useAxios.get('/detailResult/' + id).then(({ data }) => {
      if (!data.result) return setData(null);
      setData(data?.data);
      console.log(data);
    })
  }
  const newSurveyGo = () => navigate(`/survey/${id}/new/`, { state: data?.info });

  useEffect(getData, [id]);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <h2>
          <span>
            { data?.info?.NAME }
            <button className='description-btn' onClick={() => setIsModal(!isModal)}>
              <BsQuestionCircleFill color='#008a87' />
            </button>
          </span>
          {!itemData?.disabled && <button class="btn" onClick={newSurveyGo}>신규 검사</button>}
        </h2>
        <p className='description'>{data?.info?.DESCRIPTION ?? ''}</p>
      </Header>

      <List>
        {data?.list && data.list.map((item, i) => (
          <DetailSurveyLi key={i} item={item} />
        ))}
      </List>

      {isModal && <DescriptionModal
        data={{ main: data?.info?.DESCRIPTION, sub: data?.description }}
        setIsModal={setIsModal}
      />}
    </PageAnimate>
  )
}

const Header = Styled.header`
  h2 {
    position: relative;
    span {
      display: flex;
      align-items: center;
      justify-content: center;

      button.description-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: $main;
        padding: 3px;
        border: none;
        &:hover,
        &:active {
          background-color: transparent !important;
        }
      }
      i,
      svg {
        font-size: 20px;
      }
    }
  }
  .description {
    font-size: 12px;
    color: #888;
    margin-top: 10px;
  }
`;
const List = Styled.ul`
  margin-top: 30px;
`;