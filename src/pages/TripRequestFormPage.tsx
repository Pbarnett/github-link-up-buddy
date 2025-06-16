
import React from 'react';
import { useParams } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

const TripRequestFormPage = () => {
  const { tripRequestId } = useParams<{ tripRequestId: string }>();
  
  return <TripRequestForm tripRequestId={tripRequestId} />;
};

export default TripRequestFormPage;
