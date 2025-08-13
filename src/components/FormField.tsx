

// import React, { useState } from 'react';

// interface FormFieldProps {
//   name: string;
//   label: string;
//   type: string;
//   required: boolean;
//   validation?: string;
//   placeholder?: string;
//   value: string;
//   disabled?: boolean;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const FormField: React.FC<FormFieldProps> = ({
//   name,
//   label,
//   type,
//   required,
//   validation,
//   placeholder,
//   value,
//   disabled = false,
//   onChange
// }) => {
//   const [error, setError] = useState<string>('');
//   const [touched, setTouched] = useState(false);

//   const runValidation = (val: string) => {
//     if (validation && val.trim() !== '') {
//       const regex = new RegExp(validation);
//       if (!regex.test(val)) {
//         setError(`Invalid ${label}`);
//         return;
//       }
//     }
//     setError('');
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange(e);
//     if (touched) runValidation(e.target.value);
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     setTouched(true);
//     runValidation(e.target.value);
//   };

//   return (
//     <div className="mb-4">
//       <label
//         htmlFor={name}
//         className="block font-medium mb-1 text-gray-700"
//       >
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>

//       <input
//         id={name}
//         name={name}
//         type={type}
//         required={required}
//         placeholder={placeholder}
//         value={value}
//         disabled={disabled}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-sm
//           ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
//           ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}
//         `}
//       />

//       {error && (
//         <p className="text-red-500 text-sm mt-1">{error}</p>
//       )}
//     </div>
//   );
// };

// export default FormField;













import React, { useState, forwardRef } from 'react';

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  required: boolean;
  validation?: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      name,
      label,
      type,
      required,
      validation,
      placeholder,
      value,
      disabled,
      onChange
    },
    ref
  ) => {
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange(e);

      if (validation && val.length > 0) {
        const regex = new RegExp(validation);
        if (!regex.test(val)) {
          setError(`Invalid ${label}`);
        } else {
          setError('');
        }
      } else {
        setError('');
      }
    };

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
            ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}
          `}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
