import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import MemberDetail from '../components/Member_Detail';

function MemberCard() {
  const location = useLocation();
  const data = location.state?.data;

  // If data is an object with mem_id, pass mem_id to MemberDetail
  // Otherwise, handle as needed (show error or fallback)
  return (
    <div className='homepage'>
      <Header />
      {data && data.mem_id ? (
        <MemberDetail memberId={data.mem_id} />
      ) : (
        <p>No member data to display.</p>
      )}
    </div>
  );
}

export default MemberCard;