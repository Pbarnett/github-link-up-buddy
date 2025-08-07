

type FC<T = {}> = React.FC<T>;

interface SimplifiedSocialProofProps {
  className?: string;
}

export const SimplifiedSocialProof: FC<SimplifiedSocialProofProps> = ({
  className = '',
}) => {
  const [todayBookings, setTodayBookings] = useState(23);

  // Simulate live updates (in production, this would come from real-time API)
  useEffect(() => {
    const interval = setInterval(() => {
      // Occasionally increment the today bookings count
      if (Math.random() < 0.3) {
        // 30% chance every interval
        setTodayBookings(prev => prev + 1);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`social-proof-redesigned ${className}`}>
      <p>
        <strong>7,412 trips auto-booked</strong> in the last 30 days – average
        savings <strong>$186</strong>.<span className="live-indicator">●</span>{' '}
        {todayBookings} bookings today
      </p>
    </div>
  );
};

export default SimplifiedSocialProof;
