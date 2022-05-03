import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Styled from 'styled-components';

export default function ({ item }) {
  
  return (
    <Wrap>
      <h3>
        {item?.icon && <img src={item.icon} alt="아이콘" />}
        <span>{item?.TEST_TP_NM ?? '-'}</span>
      </h3>
      {/* <div v-for="(item, idx) in item.children" :key="idx">
        <h4>
          <span name v-text="item.name || '검사결과'" />
          <span result v-text="item.resultText" />
        </h4>
        <div child-contents>
          <progress class="progress" :value="item.result" max="100" />
        </div>
      </div>
      <div v-if="isDetail">
        <h4>상세정보</h4>
        <p description>
          아이의 연령 검사로 대근육은 6세, 소근육은 5세로 나왔습니다.
        </p>
        <div chart>
          <!-- <BarChart :data="chartData" /> -->
          <RadarChart :data="chartData" />
        </div>
      </div>
      <button @click="setDetail" v-text="btnName" /> */}
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0;
  }

  h3 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    font-weight: 700;
    color: #00ada9;
    margin-bottom: 10px;

    img {
      margin-right: 4px;
      height: 22px;
    }
  }

  & > div {
    padding: 16px 16px 14px;
    position: relative;
    overflow: hidden;
    background-color: #fff;
    &:first-of-type {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    h4 {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-flow: column;
      font-size: 16px;
      font-weight: 500;
      color: #282828;      

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

      .progress {
        display: block;
        width: 100%;
        border-radius: 0;

        &::-webkit-progress-bar {
          background-color: #ddd;
        }
        &::-webkit-progress-value {
          background-color: #74c2b9;
        }
        &::-moz-progress-bar {
          background-color: #ddd;
        }
      }
    }
  }

  & > button {
    display: block;
    width: 100%;
    height: 34px;
    border-radius: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: none !important;
    margin: 0;
  }
`