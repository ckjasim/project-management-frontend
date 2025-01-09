import  { useEffect, useState } from 'react';
import ManagementTable from '@/components/table/table';

import { employeeManageApi, getAllEmployeesApi } from '@/services/api/authApi';
import { useToast } from '@/components/hooks/use-toast';
type Employee = {
  _id: string;
  name: string;
  email: string;
  organization?: any;
  jobRole: string;
  createdAt: string;
  isBlock: boolean;
  dateJoined?: string;
};
const EmployeeManagement = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployeesApi();
        const employeesData = res.employees.map((employee: any) => ({
          ...employee,
          dateJoined: new Date(employee.createdAt).toLocaleDateString('en-GB'),
        }));
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleBlock = async (employeeId: string, email: string) => {
    try {
      setEmployees((prevEmployees) =>
        prevEmployees?.map((employee) =>
          employee._id === employeeId ? { ...employee, isBlock: !employee.isBlock } : employee
        )
      );

      const res = await employeeManageApi(email);
      if (res?.status === 200) {
        toast({
          title: 'Employee status has been updated',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error updating employee status:', error);

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, isBlock: !employee.isBlock } : employee
        )
      );
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'organization', 
      label: 'Organization',
      render: (employee: any) => employee.organization?.name 
    },
    { key: 'jobRole', label: 'Job Role' },
    { key: 'dateJoined', label: 'Date Joined' }
  ];

  const organizations = Array.from(
    new Set(employees.map(emp => emp.organization))
  ).filter(Boolean);

  return (
    <ManagementTable
      title="Employee Management"
      data={employees}
      columns={columns}
      onBlock={handleBlock}
      organizations={organizations}
      filterKey="organization"
      searchPlaceholder="Search by name..."
    />
  );
};

export default EmployeeManagement