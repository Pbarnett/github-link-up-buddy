
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RadixThemeDemo from "@/components/demo/RadixThemeDemo";
import { useState } from "react";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  
  if (showDemo) {
    return <RadixThemeDemo />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Parker Flight</h1>
        <p className="text-xl text-gray-600 mb-8">Smart flight search and booking platform</p>
        
        <div className="flex gap-4 justify-center mb-6">
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => setShowDemo(true)}
            variant="outline"
            size="sm"
          >
            🎨 View Theme Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
