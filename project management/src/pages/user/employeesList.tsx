import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import Modal from '@/components/global/Modal/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { addEmployeeInvitationApi } from '@/services/api/api';
import { useToast } from '@/components/hooks/use-toast';


const EmployeePage = () => {
  const { toast } = useToast();
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const employees = [
    {
      name: 'Angela Moss',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'angelas@email.com',
    },
    {
      name: 'Ahmad Zayn',
      role: 'Photographer',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'ahmadzayn@email.com',
    },
    {
      name: 'Brian Connor',
      role: 'Designer',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'brianconnor@email.com',
    },
    {
      name: 'Courtney Hawkins',
      role: 'Programmer',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'courtneyhawk@email.com',
    },
    {
      name: 'David Here',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'davidhere@email.com',
    },
    {
      name: 'Dennise Lee',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'denniselee@email.com',
    },
    {
      name: 'Erbatov Asia',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'erbatovasia@email.com',
    },
    {
      name: 'Evan Khan',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'angelas@email.com',
    },
    {
      name: 'Franklin Jr.',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'franklinjr@email.com',
    },
    {
      name: 'Gandalf Hoos',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'gandaflhoos@email.com',
    },
    {
      name: 'Gabriella',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'gabriella@email.com',
    },
    {
      name: 'Hanny Shella',
      role: 'Marketing Manager',
      image: 'https://via.placeholder.com/150',
      phone: '+12 345 6789 0',
      email: 'hannyshella@email.com',
    },
  ];
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
 

  const handleEmployeeSubmit =async (values: { name: string; email: string; jobRole: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const res = await addEmployeeInvitationApi(values)
      setShowAddEmployeeModal(false)
      
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error?.response?.data?.message || 'An error occurred during registration.',
        variant: 'destructive',
      });
    }
   
  };
  
  return (
    <div>
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
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
    <Card className="w-full ">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Employees</CardTitle>
        <Button onClick={() => setShowAddEmployeeModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">

          <PlusCircle className="w-5 h-5" />
          add employee
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-8">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${employee.image})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{employee.name}</h3>
                <p className="text-gray-500 font-medium">{employee.role}</p>
                <div className="mt-4 flex flex-col items-start space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
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
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
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
