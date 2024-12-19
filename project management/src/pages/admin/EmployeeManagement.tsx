import { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { employeeManageApi, getAllEmployeesApi } from '@/services/api/api';
import { useToast } from '@/components/hooks/use-toast';

type Employee = {
  isActive: any;
  dateJoined: string;
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  organization: any;
  isBlock: boolean;
  jobRole: string;
  projectCode: string;
  createdAt: string;
  updatedAt: string;
};

const EmployeeManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrg, setFilterOrg] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployeesApi();
        const employeesData = res.employees.map((employee: Employee) => ({
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
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, isBlock: !employee.isBlock } : employee
        )
      );

      const res = await employeeManageApi(email);
      
      if (res && res.status === 200) {
        console.log('Employee status updated:', res.data);
      } else {
        console.error('Error updating employee status on backend.');
      }

      toast({
        title: 'Employee status has been updated',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating employee status:', error);
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId ? { ...employee, isBlock: !employee.isBlock } : employee
        )
      );
    }
  };

  const filteredEmployees = employees?.filter((employee) => {
    const matchesSearch = employee?.name?.toLowerCase()
      .includes(searchTerm?.toLowerCase());
    const matchesFilter = filterOrg === 'all' || employee.organization?.name?.toLowerCase() === filterOrg.toLowerCase();
    return matchesSearch && matchesFilter;
  });

 
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-screen">
      <Card className="rounded-lg shadow-md">
        <CardHeader className="border-b border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              Employee Management
            </CardTitle>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="text-base font-medium">Organization</div>
              <div className="flex flex-wrap gap-3">
                {[
                  { organization: { _id: 'all', name: 'all' } },
                  ...employees.filter(
                    (org, index, self) =>
                      self.findIndex((o) => o.organization._id === org.organization._id) === index
                  ),
                ].map((org) => (
                  <Button
                    key={org.organization._id}
                    variant={filterOrg === org.organization.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterOrg(org.organization.name)}
                    className={filterOrg === org.organization.name ? 'bg-blue-600' : ''}
                  >
                    {org.organization.name.charAt(0).toUpperCase() + org.organization.name.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-12 pr-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 md:p-8">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden md:grid grid-cols-6 gap-8 px-6 py-4 bg-gray-50 rounded-t-lg font-semibold text-gray-600">
                <div>Name</div>
                <div>Email</div>
                <div>Organization</div>
                <div>Job Role</div>
                <div>Date Joined</div>
                <div>Actions</div>
              </div>

              {currentEmployees.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No employees match your search criteria
                </div>
              ) : (
                currentEmployees.map((employee) => (
                  <div
                    key={employee._id}
                    className="flex flex-col md:grid md:grid-cols-6 gap-4 md:gap-8 px-6 py-6 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-500 md:hidden">Name:</div>
                    <div>{employee.name}</div>
                    <div className="font-medium text-gray-500 md:hidden">Email:</div>
                    <div>{employee.email}</div>
                    <div className="font-medium text-gray-500 md:hidden">Organization:</div>
                    <div>{employee.organization?.name}</div>
                    <div className="font-medium text-gray-500 md:hidden">Job Role:</div>
                    <div>{employee.jobRole}</div>
                    <div className="font-medium text-gray-500 md:hidden">Date Joined:</div>
                    <div>{employee.dateJoined}</div>
                    <div className="flex items-center gap-4 justify-end md:justify-start">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBlock(employee._id, employee.email)}
                        className={`${
                          employee.isBlock ? 'bg-green-600' : 'bg-red-600'
                        } hover:${
                          employee.isBlock ? 'bg-green-700' : 'bg-red-700'
                        }`}
                      >
                        {employee.isBlock ? 'Unblock' : 'Block'}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10">
                        <MoreVertical size={18} />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {/* Pagination Controls */}
              {filteredEmployees.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} employees
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        const shouldShow = 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 1;
                        return shouldShow;
                      })
                      .map((page, index, array) => (
                        <>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span key={`ellipsis-${page}`} className="px-2">...</span>
                          )}
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => paginate(page)}
                            className={currentPage === page ? "bg-blue-600" : ""}
                          >
                            {page}
                          </Button>
                        </>
                      ))
                    }
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;