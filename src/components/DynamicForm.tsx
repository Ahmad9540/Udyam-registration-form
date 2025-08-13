import React, { useState, useRef } from 'react';
import FormField from './FormField';

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  validation?: string;
  placeholder?: string;
}

interface Step {
  step: number;
  title: string;
  fields: Field[];
}

interface DynamicFormProps {
  steps: Step[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const step = steps[currentStep];

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === "panNumber" ? value.toUpperCase() : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));

    if (name === 'pincode' && newValue.length === 6) {
      fetchPinDetails(newValue);
    }

    if (name === 'aadhaarNumber') {
      setOtpSent(false);
      setFormData(prev => ({ ...prev, otp: '' }));
    }
  };

  // Send OTP
  const sendOtp = async () => {
    const aadhaarField = step.fields.find(f => f.name === "aadhaarNumber");
    if (!formData['aadhaarNumber']) {
      setErrors({ ...errors, aadhaarNumber: 'Aadhaar Number is required' });
      return;
    }
    if (aadhaarField?.validation) {
      const regex = new RegExp(aadhaarField.validation);
      if (!regex.test(formData['aadhaarNumber'])) {
        setErrors({ ...errors, aadhaarNumber: 'Please enter a valid 12-digit Aadhaar number' });
        return;
      }
    }
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar: formData['aadhaarNumber'] }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrors({ ...errors, aadhaarNumber: data.message || "Unable to send OTP" });
        return;
      }
      setOtpSent(true);
      startResendTimer();
      setTimeout(() => otpInputRef.current?.focus(), 200);
      alert("OTP sent! (Check server console in dev mode)");
    } catch (err) {
      setErrors({ ...errors, aadhaarNumber: "Failed to send OTP (server error)" });
    }
  };

  // Start resend cooldown
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Validate fields in current step
  const validateStep = () => {
    let newErrors: Record<string, string> = {};
    step.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validation) {
        const regex = new RegExp(field.validation);
        if (!regex.test(formData[field.name] || '')) {
          newErrors[field.name] = `Invalid ${field.label}`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === 0) {
      try {
        const res = await fetch("http://localhost:5000/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aadhaar: formData['aadhaarNumber'], otp: formData['otp'] }),
        });
        const data = await res.json();
        if (!data.success) {
          setErrors({ ...errors, otp: data.message || "OTP verification failed" });
          return;
        }
      } catch (err) {
        setErrors({ ...errors, otp: "OTP verification failed (server error)" });
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setOtpSent(false);
    } else {
      try {
        const res = await fetch("http://localhost:5000/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          alert("Form submitted successfully!");
          setFormData({});
          setCurrentStep(0);
        } else {
          alert(`Submit failed: ${data.message}`);
        }
      } catch (err) {
        alert("Form submission failed (server error)");
      }
    }
  };

  // Fetch PIN code details
  const fetchPinDetails = async (pin: string) => {
    if (!/^[1-9][0-9]{5}$/.test(pin)) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice?.[0];
        if (postOffice) {
          setFormData(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
        }
      } else {
        alert("Invalid PIN code or details not found");
      }
    } catch (err) {
      alert("PIN lookup failed");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* Step Indicators */}
      <div className="flex justify-center mb-4 gap-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${index === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-center mb-4">{step.title}</h2>

      <form className="space-y-4">
        {step.fields.map((field) => {
          if (field.name === 'sendOtpButton') {
            return (
              <button
                type="button"
                key={field.name}
                onClick={sendOtp}
                disabled={resendTimer > 0}
                className={`px-4 py-2 rounded text-white ${resendTimer > 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : field.label}
              </button>
            );
          }
          if (field.name === 'otp') {
            return (
              <div key={field.name}>
                <FormField
                  {...field}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  disabled={!otpSent}
                  ref={otpInputRef}
                />
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
              </div>
            );
          }
          return (
            <div key={field.name}>
              <FormField
                {...field}
                value={formData[field.name] || ''}
                onChange={handleChange}
              />
              {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
            </div>
          );
        })}

        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
