
export interface Offer {
  id: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
}

export const fetchTripOffers = async (): Promise<Offer[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // More detailed mock data - in a real app, we would fetch this from an API
  const mockOffers: Offer[] = [
    { 
      id: 'offer-1', 
      price: 850, 
      airline: 'Delta Airlines',
      flight_number: 'DL1234',
      departure_date: '2025-05-20',
      departure_time: '08:30',
      return_date: '2025-05-27',
      return_time: '14:45',
      duration: '2h 15m'
    },
    { 
      id: 'offer-2', 
      price: 920, 
      airline: 'United Airways',
      flight_number: 'UA5678',
      departure_date: '2025-05-21',
      departure_time: '10:15',
      return_date: '2025-05-28',
      return_time: '16:30',
      duration: '2h 45m'
    },
    { 
      id: 'offer-3', 
      price: 780, 
      airline: 'American Airlines',
      flight_number: 'AA2468',
      departure_date: '2025-05-20',
      departure_time: '13:45',
      return_date: '2025-05-27',
      return_time: '19:20',
      duration: '3h 05m'
    },
    { 
      id: 'offer-4', 
      price: 845, 
      airline: 'JetBlue',
      flight_number: 'JB7531',
      departure_date: '2025-05-22',
      departure_time: '06:20',
      return_date: '2025-05-29',
      return_time: '11:50',
      duration: '2h 30m'
    },
    { 
      id: 'offer-5', 
      price: 795, 
      airline: 'Southwest',
      flight_number: 'SW9753',
      departure_date: '2025-05-23',
      departure_time: '11:30',
      return_date: '2025-05-30',
      return_time: '15:45',
      duration: '1h 55m'
    },
    { 
      id: 'offer-6', 
      price: 1050, 
      airline: 'Alaska Airlines',
      flight_number: 'AS4682',
      departure_date: '2025-05-21',
      departure_time: '15:40',
      return_date: '2025-05-28',
      return_time: '20:15',
      duration: '3h 25m'
    },
    { 
      id: 'offer-7', 
      price: 925, 
      airline: 'British Airways',
      flight_number: 'BA8642',
      departure_date: '2025-05-22',
      departure_time: '09:50',
      return_date: '2025-05-29',
      return_time: '14:30',
      duration: '7h 10m'
    }
  ];
  
  return mockOffers;
};
