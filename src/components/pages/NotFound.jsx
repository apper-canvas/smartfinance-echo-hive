import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={40} className="text-white" />
        </div>
        
        <h1 className="text-6xl font-bold gradient-text mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist. It might have been moved, 
          deleted, or you might have typed the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={goHome}
            className="flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Home" size={16} />
            <span>Go Home</span>
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg"
            onClick={goBack}
            className="flex items-center justify-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Go Back</span>
          </Button>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Or try one of these helpful links:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg p-3 transition-colors duration-200"
            >
              <ApperIcon name="Receipt" size={16} className="mx-auto mb-1" />
              Transactions
            </button>
            
            <button
              onClick={() => navigate("/budgets")}
              className="text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg p-3 transition-colors duration-200"
            >
              <ApperIcon name="PiggyBank" size={16} className="mx-auto mb-1" />
              Budgets
            </button>
            
            <button
              onClick={() => navigate("/goals")}
              className="text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg p-3 transition-colors duration-200"
            >
              <ApperIcon name="Target" size={16} className="mx-auto mb-1" />
              Goals
            </button>
            
            <button
              onClick={() => navigate("/reports")}
              className="text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg p-3 transition-colors duration-200"
            >
              <ApperIcon name="BarChart3" size={16} className="mx-auto mb-1" />
              Reports
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;