
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Supabase Auth Demo</h1>
        <p className="text-xl text-gray-600 mb-8">A simple authentication example with Supabase and React</p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
