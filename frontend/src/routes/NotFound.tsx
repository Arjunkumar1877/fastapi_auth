import React from "react";
import { Button } from "@/components/ui/button"; 
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Button onClick={handleGoHome} className="px-6 py-3">
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;