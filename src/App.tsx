
import React from "react";
import DynamicForm from "./components/DynamicForm";
import ProgressTracker from "./components/ProgressTracker";
import formSchema from "./data/formSchema.json";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Udyam Registration Form
        </h1>

        {/* Progress Tracker */}
        {/* currentStep will be passed from DynamicForm */}
        {/* If you want to keep it inside DynamicForm, you can remove this and move inside */}
        <DynamicForm steps={formSchema.steps} />
      </div>
    </div>
  );
}

export default App;
