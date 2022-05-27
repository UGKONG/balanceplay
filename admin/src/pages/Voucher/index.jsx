import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';

export default function 이용권 () {
  const [categoryList, setCategoryList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const getList = () => {
    useAxios.get('/voucher').then(({ data }) => {
      if (!data?.result) {
        setCategoryList([]);
        setActiveCategory(null);
        return;
      }
      setCategoryList(data?.data);
      setActiveCategory(data?.data[0]);
    })
  }

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up'>
      {JSON.stringify(categoryList)}
      <br />
      <br />
      <br />
      {JSON.stringify(activeCategory)}
    </PageAnimate>
  )
}

