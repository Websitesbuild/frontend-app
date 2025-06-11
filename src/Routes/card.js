import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Detail from '../components/Project_Detail';
function Card() {
  const location = useLocation();
  const data = location.state?.data;
  return (
    <div className='homepage'>
        <Header />
        <Detail data={data}/>
    </div>
  );
}

export default Card;
