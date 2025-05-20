
import TripRequestForm from "@/components/trip/TripRequestForm";

const TripNew = () => {
  console.log("TripNew page rendering - test version");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-xl font-bold mb-4">Hello from TripNew</div>
      <TripRequestForm />
    </div>
  );
};

export default TripNew;
