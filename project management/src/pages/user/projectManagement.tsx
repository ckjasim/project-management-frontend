import React, { useState, useCallback, useEffect } from 'react';
import {
  PlusCircle,
  Users,
  ChevronDown,
  Loader2,
  FolderPlus,
  X,
} from 'lucide-react';

import Modal from '@/components/global/Modal/Modal';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import {
  createProjectApi,
  createTeamApi,
  editProjectApi,
  getAllProjectApi,
  getEmployeesByOrganizationApi,
  getTeamsApi,
} from '@/services/api/api';
import { ProjectCard } from '@/components/project/projectCard';
import {
  Employee,
  Project,
  ProjectFormValues,
  Team,
  TeamFormValues,
} from '@/types';

const getProjectStatus = (
  dueDate: string
): 'completed' | 'overdue' | 'active' => {
  const today = new Date();
  const due = new Date(dueDate);
  if (due < today) return 'overdue';
  return 'active';
};

const projectValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Title is required')
    .matches(/^(?!\s*$).+/, 'Enter a valid title'),
  description: Yup.string().trim().required('Description is required'),
  dueDate: Yup.date().required('Due date is required').nullable(),
  teams: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one team is required')
    .required('Team is required'),
  priority: Yup.string().required('Priority is required'),
});

const teamValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .matches(/^(?!\s*$).+/, 'Enter a valid team name')
    .required('Team name is required'),
  employees: Yup.array()
    .min(1, 'Please select at least one employee')
    .of(Yup.string().required('Employee ID is required')),
});

const ProjectDashboard: React.FC = () => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [isAddingNewTeam, setIsAddingNewTeam] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editProject, setEditProject] = useState<Project | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await getAllProjectApi();
        const formattedProjects = res.projects.map((project: Project) => ({
          ...project,
          expiry: getProjectStatus(project.dueDate),
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const TeamSelect: React.FC<{
    values: any;
    setFieldValue: (field: string, value: any) => void;
  }> = ({ values, setFieldValue }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleTeamChange = (teamId: string) => {
      const currentTeams = values?.teams || [];
      const updatedTeams = currentTeams.includes(teamId)
        ? currentTeams.filter((id: string) => id !== teamId)
        : [...currentTeams, teamId];

      setFieldValue('teams', updatedTeams);
    };

    const removeTeam = (teamId: string) => {
      const updatedTeams = (values?.teams || []).filter(
        (id: string) => id !== teamId
      );
      setFieldValue('teams', updatedTeams);
    };

    const createNewTeam = async () => {
      setIsLoading(true);
      try {
        const res = await getEmployeesByOrganizationApi();
        setEmployees(res?.employees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }

      setIsAddingNewTeam(true);
      setIsOpen(false);
    };

    return (
      <div className="space-y-2">
        <label
          htmlFor="team-select"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <Users size={18} className="text-gray-500" />
          Select Teams
        </label>

        <div className="relative">
          {/* Selected Teams Chips */}
          {values?.teams?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {values.teams.map((teamId: string) => {
                const team = teams.find((t) => t.id === teamId);
                return team ? (
                  <div
                    key={teamId}
                    className="flex items-center bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs"
                  >
                    {team.name}
                    <button
                      type="button"
                      onClick={() => removeTeam(teamId)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          )}

          <div
            onClick={() => !isLoading && setIsOpen(!isOpen)}
            className={`
              w-full rounded-lg border-2 bg-white px-4 py-3 pr-10 text-gray-700 
              flex items-center justify-between cursor-pointer
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
            `}
          >
            {values?.teams?.length > 0
              ? `${values.teams.length} team(s) selected`
              : 'Choose your teams...'}

            <div className="flex items-center">
              {isLoading ? (
                <Loader2 className="animate-spin text-blue-500 w-5 h-5" />
              ) : (
                <ChevronDown
                  className={`text-gray-400 w-5 h-5 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </div>
          </div>

          {isOpen && !isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-white border-2 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {teams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => handleTeamChange(team.id)}
                  className={`
                    px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center
                    ${
                      (values?.teams || []).includes(team.id)
                        ? 'bg-blue-100'
                        : ''
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={(values?.teams || []).includes(team.id)}
                    readOnly
                    className="mr-2 pointer-events-none"
                  />
                  {team.name}
                </div>
              ))}
              <div
                onClick={() => {
                  setFieldValue('teams', []);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-center text-gray-500 hover:bg-gray-50 cursor-pointer border-t"
              >
                Clear Selection
              </div>
              <div
                onClick={() => {
                  createNewTeam();
                }}
                className="px-4 py-2 text-center text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
              >
                + Create New Team
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleAddProject = useCallback(async () => {
    try {
      const res = await getTeamsApi();
      console.log();
      const formattedTeams = res.teams.map(
        (team: { _id: string; name: string }) => ({
          name: team.name,
          id: team._id,
        })
      );
      setTeams(formattedTeams);
      setShowAddProjectModal(true);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, []);

  const handleProjectSubmit = async (
    values: ProjectFormValues,
    { setSubmitting }: any
  ) => {
    try {
      console.log('jjjjjj');
      console.log(values);
      const newProject = await createProjectApi(values);
      console.log(newProject);
      setProjects((prev) => [
        ...prev,
        {
          ...newProject.createdProject,
          expiry: getProjectStatus(newProject.createdProject.dueDate),
        },
      ]);
      console.log(projects, 'ljfsfsdfdsf=----------------------');
      setShowAddProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamSubmit = async (
    values: TeamFormValues,
    { setSubmitting, setFieldValue }: any
  ) => {
    try {
      const newTeam = await createTeamApi(values);
      setTeams((prev) => [
        ...prev,
        {
          name: newTeam.createdTeam.name,
          id: newTeam.createdTeam._id,
        },
      ]);
      setIsAddingNewTeam(false);

      setFieldValue('team', [...values.name, newTeam.createdTeam._id]);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Modal
        showModal={showAddProjectModal}
        setShowModal={setShowAddProjectModal}
      >
        <Formik
          initialValues={{
            title: '',
            description: '',
            dueDate: '',
            teams: [],
            priority: '',
          }}
          validationSchema={projectValidationSchema}
          onSubmit={handleProjectSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="bg-white rounded-xl p-8 w-full max-w-md mx-auto shadow-xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Create Project
              </h1>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Title
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter project title"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    placeholder="Detailed project description"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <TeamSelect values={values} setFieldValue={setFieldValue} />
                <ErrorMessage
                  name="teams"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Priority
                  </label>
                  <Field
                    name="priority"
                    as="select"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select priority...</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Due Date
                  </label>
                  <Field
                    name="dueDate"
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="dueDate"
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
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      ;
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
      ;
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-500 mt-1">
              Manage and track your team's projects
            </p>
          </div>
          <Button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Create Project
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                setProjects={setProjects}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
