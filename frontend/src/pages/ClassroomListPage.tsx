import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyClassPage } from './MyClassPage';

export const ClassroomListPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/my-class?tab=classrooms', { replace: true });
  }, [navigate]);

  return <MyClassPage />;
};

export default ClassroomListPage;

