import React, { useState, useRef, useEffect } from 'react';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface Option {
  value?: any;
  label: string;
  color?: string;
  className?: any;
}

interface CustomSelectProps {
  value: any ;
  onValueChange: any;
  placeholder: string;
  options: Option[];
  renderOption?: any;
  className?: any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder, 
  options, 
  renderOption, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target as Node) &&
        optionsRef.current && 
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find selected option
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative w-full" ref={selectRef}>
      {/* Select Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm",
          "focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer",
          className
        )}
      >
        {selectedOption ? (
          renderOption ? renderOption(selectedOption) : selectedOption.label
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <svg 
          className="h-4 w-4 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Options Dropdown */}
      {isOpen && (
        <div 
          ref={optionsRef}
          className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm",
                value === option.value && "bg-blue-50",
                option.className
              )}
            >
              {renderOption ? renderOption(option) : option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PrioritySelect component types
interface PrioritySelectProps {
  priority: string;
  setPriority: (value: string) => void;
  priorityLevels: { value: string; label: string; color: string }[];
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ priority, setPriority, priorityLevels }) => {
  const renderPriorityOption = (option: { value: string; label: string; color: string }) => (
    <div className="flex items-center">
      <span className={`mr-2 ${option.color}`}>●</span>
      {option.label}
    </div>
  );

  return (
    <CustomSelect
      value={priority}
      onValueChange={setPriority}
      placeholder="Select Priority"
      options={priorityLevels}
      renderOption={renderPriorityOption}
      className="w-full"
    />
  );
};


interface EmployeeSelectProps {
  assignedEmployee: string;
  setAssignedEmployee: (value: string) => void;
  teamMembers: { _id: string; name: string }[];
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = ({ assignedEmployee, setAssignedEmployee, teamMembers }) => {
  return (
    <CustomSelect
      value={assignedEmployee}
      onValueChange={setAssignedEmployee}
      placeholder="Select Employee"
      options={teamMembers?.map(employee => ({
        value: employee._id,
        label: employee.name
      }))}
      className="w-full"
    />
  );
};

export { PrioritySelect, EmployeeSelect };