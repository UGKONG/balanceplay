import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';

export default function ({ item, surveyId }) {
  const navigate = useNavigate();
  const surveyedView = () => navigate(`/survey/${surveyId}/`)
  
  let date = item?.date?.split(' ')[0];
  if (!date) return null;
  return (
    <Wrap>
      <h3>
        <span className='date'>{date}</span>
        <button className='btn' onClick={surveyedView} small>작성결과보기</button>
      </h3>
      <div contents>
        <div percent>
          <img src="percentImage" />
          <p>현재 OOO의 개월 수</p>
          <span>(60개월)</span>
        </div>
        <ul chart>
          <li>
            <h4>대근육 발달 검사 (70%)</h4>
            <progress max="100" value="70" />
            <p>최대 60~71개월, 현재 54~59개월</p>
          </li>
          <li>
            <h4>소근육 발달 검사 (60%)</h4>
            <progress max="100" value="60" />
            <p>최대 60~71개월, 현재 54~59개월</p>
          </li>
        </ul>
      </div>
    </Wrap>
  )

}

const Wrap = Styled.li`
  margin-bottom: 50px;

  h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #444;
    position: relative;
    margin-bottom: 10px;

    .date {
      display: block;
      width: 110px;
    }

    &::after {
      content: "";
      width: calc(100% - 200px);
      height: 1px;
      position: absolute;
      top: 50%;
      right: 110px;
      background-color: #aaa;
      transform: translateY(1px);
    }

    button {
      margin-right: 0 !important;
    }
  }

  [contents] {
    font-size: 14px;

    [percent] {
      img {
        width: 50%;
        display: block;
        margin: 0 auto;
      }
      p {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        color: #00ada9;
      }
      span {
        display: block;
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        color: #00ada9;
        letter-spacing: 1px;
      }
    }

    [chart] {
      margin-top: 20px;

      li {
        margin-bottom: 20px;
        h4 {
          font-size: 14px;
          font-weight: 500;
          color: #00ada9;
        }
        progress {
          width: 100%;
          height: 20px;
          margin: 10px 0;
          border-radius: 0;
          background-color: #94d1ca;

          &::-webkit-progress-bar {
            background-color: #ddd;
          }
          &::-webkit-progress-value {
            background-color: #008a87;
          }
        }
        p {
          font-size: 14px;
          font-weight: 500;
          color: #282828;
        }
      }
    }
  }
`