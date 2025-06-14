
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          ✈️ Welcome to <span className="text-blue-600">LinkUp Buddy</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plan smarter trips with LinkUp Buddy. Fast, collaborative booking, powered by Supabase Auth and React.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
        <div className="mt-8 text-gray-400 text-sm">
          Built with <span className="font-semibold">Supabase</span>, <span className="font-semibold">React</span> & <span className="font-semibold">Shadcn UI</span>
        </div>
      </div>
    </div>
  );
};

export default Index;

