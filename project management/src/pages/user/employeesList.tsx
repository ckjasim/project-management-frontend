import  { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, } from 'lucide-react';
import Modal from '@/components/global/Modal/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { addEmployeeInvitationApi, getEmployeesByOrganizationApi } from '@/services/api/authApi';
import { useToast } from '@/components/hooks/use-toast';
   
interface Employee {
  _id: string;
  name: string;
  email: string;
  jobRole: string;
  mobile: string;
  profileImage?: { url: string };
}
const EmployeePage = () => {
  const { toast } = useToast();
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [employees,setEmployees]=useState<Employee[]>([])

  useEffect(()=>{
  const fetchEmployee=async ()=>{

    const empResponse = await getEmployeesByOrganizationApi();
    setEmployees(empResponse?.data?.all)
    }
    fetchEmployee()
  },[])
  const addEmployeeValidationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required('Name is required')
      .matches(/^(?!\s*$).+/, 'Enter a valid name'),
    email: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
    jobRole: Yup.string()
      .trim()
      .required('Job role is required'),
  });
 

  const handleEmployeeSubmit =async (values: { name: string; email: string; jobRole: string }) => {
    try {
       await addEmployeeInvitationApi(values)
      setShowAddEmployeeModal(false)
      toast({
        title: 'Invitation send ',
        description: 'invitaion send to employee email',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'An error occurred during registration.',
        variant: 'destructive',
      });
    }
   
  };
  
  return (
    <div className='bg-gradient-to-br from-zinc-50 to-teal-50'>
      <Modal showModal={showAddEmployeeModal} setShowModal={setShowAddEmployeeModal}>
  <Formik
    initialValues={{
      name: '',
      email: '',
      jobRole: '',
    }}
    validationSchema={addEmployeeValidationSchema}
    onSubmit={handleEmployeeSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="bg-white rounded-xl p-8 w-full max-w-md mx-auto shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Employee</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <Field
              name="name"
              type="text"
              placeholder="Enter employee name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <Field
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Role</label>
            <Field
              name="jobRole"
              type="text"
              placeholder="Designer"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <ErrorMessage
              name="jobRole"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating...
              </div>
            ) : (
              'Add Employee'
            )}
          </Button>
        </div>
      </Form>
    )}
  </Formik>
</Modal>
<Card className="w-full bg-gradient-to-br from-zinc-50 to-teal-50">
  <CardHeader className="flex flex-row justify-between">
    <CardTitle className='text-gray-700 text-3xl font-semibold m-2'>Employees</CardTitle>
    <Button
      onClick={() => setShowAddEmployeeModal(true)}
      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
    >
      <PlusCircle className="w-5 h-5" />
      Add Employee
    </Button>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-5 gap-8">
      {employees?.map((employee, index) => (
        <div
          key={index}
          className="bg-white  rounded-xl shadow-md overflow-hidden flex flex-col items-center p-4"
        >
          {/* Profile Image */}
          <div className="relative  pt-8">
            <img
              src={employee.profileImage?.url || "https://via.placeholder.com/150"}
              alt={`${employee.name || "Employee"}'s Profile`}
              className="h-20 w-20 object-cover rounded-full shadow-lg"
            />
          </div>

          {/* Employee Details */}
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold">{employee?.name}</h3>
            <p className="text-gray-500 font-medium">{employee?.jobRole}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{employee.mobile}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{employee.email}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

    </div>
  );
};

export default EmployeePage;
