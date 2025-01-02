import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Loader2, PlusCircle, Users } from 'lucide-react';
import Modal from '@/components/global/Modal/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  addTeamMemberApi,
  getTeamMembersByTeamIdApi,
} from '@/services/api/projectApi';
import { getEmployeesByOrganizationApi } from '@/services/api/authApi';
import { useToast } from '@/components/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Employee, TeamFormValues } from '@/types';

const teamValidationSchema = Yup.object().shape({
  employees: Yup.array()
    .min(1, 'Please select at least one employee')
    .of(Yup.string().required('Employee ID is required')),
});

const TeamList = () => {
  const { toast } = useToast();
  const { id: id } = useParams();
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newMembers, setNewMembers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        const res = await getTeamMembersByTeamIdApi(id);
        setTeamMembers(res.teamMembers.members);
      }
    };
    fetchEmployee();
  }, []);

  const handleTeamSubmit = async (
    values: any,
    { setSubmitting, setFieldValue }: any
  ) => {
    try {
      console.log(values);
      const newMember = await addTeamMemberApi(id, values);
      console.log(newMember);
      setTeamMembers(newMember.createdTeam.members);
      setShowAddEmployeeModal(false);

      //  setFieldValue('team', [...values.name, newTeam.createdTeam._id]);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setSubmitting(false);
    }
  };
  const createNewTeam = async () => {
    setIsLoading(true);
    try {
      const res = await getEmployeesByOrganizationApi();
      if (res) {
        setEmployees(res?.data.all || []);
        const newMembers = employees.filter(
          (employee: any) =>
            !teamMembers.some((member: any) => member._id === employee._id)
        );

        setNewMembers(newMembers);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }

    setShowAddEmployeeModal(true);
    //  setIsOpen(false);
  };

  return (
    <div>
      <Modal
        showModal={showAddEmployeeModal}
        setShowModal={setShowAddEmployeeModal}
      >
        <Formik
          initialValues={{
            employees: [],
          }}
          validationSchema={teamValidationSchema}
          onSubmit={handleTeamSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="bg-white rounded-xl p-8 w-full max-w-2xl mx-auto">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Add Members
                  </h1>
                </div>
                <div className=" flex justify-end space-x-4">
                  {/* <Button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button> */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Members'}
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                <ErrorMessage
                  name="employees"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
                <div>
                  <label className="block text-gray-700 font-medium mb-4">
                    Team Members
                  </label>

                  {newMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newMembers.map((employee) => (
                        <div
                          key={employee._id}
                          className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Field
                            type="checkbox"
                            name="employees"
                            value={employee._id}
                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            onChange={(e: { target: { checked: any } }) => {
                              const newEmployees = e.target.checked
                                ? [...values.employees, employee._id]
                                : values.employees.filter(
                                    (id) => id !== employee._id
                                  );
                              setFieldValue('employees', newEmployees);
                            }}
                          />
                          <div className="ml-4 flex-1">
                            <p className="font-medium text-gray-700">
                              {employee.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {employee.jobRole}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No employees available</p>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center space-x-2 mr-8"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">Team Members</CardTitle>
          </div>
          <Button
            onClick={() => createNewTeam()}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add a Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-8">
            {teamMembers?.map((employee, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-4"
              >
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={employee.profileImage?.url || ''}
                    alt={`${employee.name || 'Employee'}'s Profile`}
                    className="h-40 w-40 object-cover rounded-full shadow-lg"
                  />
                </div>

                {/* Employee Details */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold">{employee?.name}</h3>
                  <p className="text-gray-500 font-medium">
                    {employee?.jobRole}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <svg
                        xmlns=""
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
                        xmlns=""
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

export default TeamList;
