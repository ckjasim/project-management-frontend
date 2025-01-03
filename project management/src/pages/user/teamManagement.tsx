import React, { useEffect, useState } from 'react';
import { Trash2, PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/global/Modal/Modal';
import { ErrorMessage, Field, Formik, Form } from 'formik';

import { Employee, TeamFormValues } from '@/types';
import { createTeamApi, getTeamsApi } from '@/services/api/projectApi';
import { getEmployeesByOrganizationApi } from '@/services/api/authApi';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const TeamDashboard: React.FC = () => {
  // State Management
  const [isAddingNewTeam, setIsAddingNewTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const navigate = useNavigate();
  // Color Palette for Team Cards
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getTeamsApi();
        console.log(res);
        const formattedTeams = res.teams.map(
          (team: { _id: string; name: string }) => ({
            name: team.name,
            id: team._id,
            color: colors[Math.floor(Math.random() * colors.length)],
          })
        );
        setTeams(formattedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // Prepare for Team Creation
  const addTeam = async () => {
    setIsLoading(true);
    try {
      const res = await getEmployeesByOrganizationApi();
      setEmployees(res?.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
      setIsAddingNewTeam(true);
    }
  };

  // Remove Team
  const removeTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId));
  };

  // Validation Schema for Team Creation
  const teamValidationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid team name')
      .required('Team name is required'),
    employees: Yup.array()
      .min(1, 'Please select at least one employee')
      .of(Yup.string().required('Employee ID is required')),
  });

  const handleTeamSubmit = async (
    values: TeamFormValues,
    { setSubmitting, setFieldValue }: any
  ) => {
    try {
      console.log(values);
      const res = await createTeamApi(values);

      const newTeam = {
        id: res.createdTeam._id,
        name: res.createdTeam.name,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setTeams([...teams, newTeam]);
      setIsAddingNewTeam(false);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="  w-full h-full p-10 bg-gradient-to-br from-zinc-50 to-teal-50">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-700 text-3xl font-semibold m-2">Teams</h1>
          <p className="text-gray-500 mt-1">Assign tasks here</p>
        </div>
        <Button
          onClick={addTeam}
          className="flex items-center gap-2 bg-gradient-to-br from-indigo-500  to-teal-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Create Team
        </Button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="transform transition-all duration-300 hover:scale-95 hover:shadow-xl"
            onClick={() => {
              navigate(`/user/teams/${team.id}`);
            }}
          >
            <CardHeader className="relative">
              <div
                className={`absolute inset-0 ${team.color} opacity-20 rounded-t-xl`}
              ></div>
              <CardTitle className="z-10 flex justify-between items-center">
                <span className="text-2xl font-semibold">
                  {team.name?.charAt(0).toUpperCase() +
                    team.name?.slice(1).toLowerCase()}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTeam(team.id)}
                  className="hover: hover:text-teal-600 "
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div
                className={`h-2 w-full ${team.color} rounded-full opacity-50`}
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal showModal={isAddingNewTeam} setShowModal={setIsAddingNewTeam}>
        <Formik
          initialValues={{
            name: '',
            employees: [],
          }}
          validationSchema={teamValidationSchema}
          onSubmit={handleTeamSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="bg-white rounded-xl p-8 w-full max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Create Team
              </h1>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Team Name
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter team name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-4">
                    Team Members
                  </label>
                  {employees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employees.map((employee) => (
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
                  <ErrorMessage
                    name="employees"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsAddingNewTeam(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Team'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default TeamDashboard;
