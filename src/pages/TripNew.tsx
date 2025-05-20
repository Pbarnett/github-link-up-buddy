
import TripRequestForm from "@/components/trip/TripRequestForm";

const TripNew = () => {
  console.log("TripNew page rendering");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <TripRequestForm />
    </div>
  );
};

export default TripNew;
