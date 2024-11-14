import React, { useState, useCallback, useEffect } from 'react';
import {
  PlusCircle,
  MoreVertical,
  Users,
  ChevronDown,
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FolderPlus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Modal from '@/components/global/Modal/Modal';
import { Input } from '@/components/ui/input';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import {
  createProjectApi,
  createTeamApi,
  deleteProjectApi,
  editProjectApi,
  getAllProjectApi,
  getEmployeesByOrganizationApi,
  getTeamsApi,
} from '@/services/api/api';

interface Employee {
  _id: string;
  name: string;
  jobRole: string;
}

interface Team {
  id: string;
  name: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  summary: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  teamId: string;
  status: 'completed' | 'overdue' | 'active';
  team?: Team;
  participants?: number;
}

interface ProjectFormValues {
  title: string;
  summary: string;
  description: string;
  dueDate: string;
  team?: string;
  priority: string;
}

interface TeamFormValues {
  title: string;
  employees: string[];
}

const projectValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Title is required')
    .matches(/^(?!\s*$).+/, 'Enter a valid title'),
  summary: Yup.string()
    .trim()
    .required('Summary is required')
    .matches(/^(?!\s*$).+/, 'Enter a valid summary'),
  description: Yup.string(),
  dueDate: Yup.date().required('Due date is required').nullable(),
  team: Yup.string().required('Team is required'),
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
          status: getProjectStatus(project.dueDate),
          
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

  const getProjectStatus = (
    dueDate: string
  ): 'completed' | 'overdue' | 'active' => {
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return 'overdue';
    return 'active';
  };

  const getPriorityColor = (priority: string) => {
    return 'text-red-500 bg-red-50';
    console.log(priority,'dddddddddddddddddddddddd')
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-orange-500 bg-orange-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
      setShowOptions((prev) => !prev);
    };

    const handleEdit = async () => {
      console.log(`Editing project: ${project._id}`);
      const res = await getTeamsApi();
      const formattedTeams = res.teams.map(
        (team: { _id: string; teamName: string }) => ({
          name: team.teamName,
          id: team._id,
        })
      );
      setTeams(formattedTeams);
      const projectToEdit = projects.find((p) => p._id === project._id);

      if (projectToEdit) {
        setEditProject(projectToEdit);
        setShowEditProjectModal(true);
      }
    };

    const handleDelete = async () => {
      try {
        const res = await deleteProjectApi(project._id);

        if (res) {
          setProjects((prev) => prev.filter((prj) => prj._id !== project._id));
        } else {
          console.error('Error deleting project:', res.message);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    };

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getPriorityColor(
                  project.priority
                )}`}
              >
              urgent
              </span>
            </div>

            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={toggleOptions}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                  <ul className="text-sm">
                    <li
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={handleEdit}
                    >
                      Edit
                    </li>
                    <li
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={handleDelete}
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          

          <div className="flex flex-col space-y-3">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(project.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(project.status)}
                <span className="text-sm font-medium capitalize">
                  {project.status}
                </span>
              </div>

              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeamSelect: React.FC<{ values: any; setFieldValue: any }> = ({
    values,
    setFieldValue,
  }) => (
    <div className="space-y-2">
      <label
        htmlFor="team-select"
        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
      >
        <Users size={18} className="text-gray-500" />
        Select Team
      </label>

      <div className="relative">
        <select
          id="team-select"
          value={values?.team || ''}
          onChange={(e) => handleTeamChange(e, setFieldValue)}
          disabled={isLoading}
          className="w-full rounded-lg border-2 bg-white px-4 py-3 pr-10 text-gray-700 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            Choose your team...
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
          <option value="addNew" className="font-medium text-blue-600">
            + Create New Team
          </option>
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="animate-spin text-blue-500 w-5 h-5" />
          ) : (
            <ChevronDown className="text-gray-400 w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );

  const handleAddProject = useCallback(async () => {
    try {
      const res = await getTeamsApi();
      const formattedTeams = res.teams.map(
        (team: { _id: string; teamName: string }) => ({
          name: team.teamName,
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
      const newProject = await createProjectApi(values);
      console.log(newProject, '123123123');
      // const {}
      setProjects((prev) => [
        ...prev,
        {
          ...newProject,
          status: getProjectStatus(newProject.dueDate),
        },
      ]);
      setShowAddProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditProjectSubmit = async (
    values: ProjectFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const res = await editProjectApi(editProject?._id, values);
      console.log(editProject?._id, 'llllllllllllllllllsss');
      console.log(res.editedProject, 'ddddddddddddddddddddfdfdfdfdfd');
      setProjects((prev) =>
        prev.map((project) =>
          project._id === editProject?._id
            ? {
                ...project,
                ...res.editedProject,
                status: getProjectStatus(res.editedProject.dueDate),
              }
            : project
        )
      );
      setEditProject(null);
      setShowEditProjectModal(false);
    } catch (error) {
      console.error('Error editing project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamSubmit = async (
    values: TeamFormValues,
    { setSubmitting }: any
  ) => {
    try {
      const newTeam = await createTeamApi(values);
      setTeams((prev) => [
        ...prev,
        {
          name: newTeam.createdTeam.teamName,
          id: newTeam.createdTeam._id,
        },
      ]);
      setIsAddingNewTeam(false);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const value = e.target.value;
    setFieldValue('team', value);

    if (value === 'addNew') {
      setIsLoading(true);
      try {
        const res = await getEmployeesByOrganizationApi();
        setEmployees(res?.employees || []);
        setIsAddingNewTeam(true);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Modal
        showModal={showEditProjectModal}
        setShowModal={setShowEditProjectModal}
      >
        <Formik
          initialValues={{
            title: editProject?.title || '',
            summary: editProject?.summary || '',
            description: editProject?.description || '',
            dueDate: editProject?.dueDate || '',
            team: editProject?.team || '',
            priority: editProject?.priority || '',
          }}
          validationSchema={projectValidationSchema}
          onSubmit={handleEditProjectSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="bg-white rounded-xl p-8 w-full max-w-md mx-auto shadow-xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Edit Project
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
                    Summary
                  </label>
                  <Field
                    name="summary"
                    type="text"
                    placeholder="Brief project summary"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="summary"
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
                </div>

                <TeamSelect values={values} setFieldValue={setFieldValue} />

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
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Editing...
                    </div>
                  ) : (
                    'Edit Project'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal
        showModal={showAddProjectModal}
        setShowModal={setShowAddProjectModal}
      >
        <Formik
          initialValues={{
            title: '',
            summary: '',
            description: '',
            dueDate: '',
            team: '',
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
                    Summary
                  </label>
                  <Field
                    name="summary"
                    type="text"
                    placeholder="Brief project summary"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="summary"
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
                </div>

                <TeamSelect values={values} setFieldValue={setFieldValue} />

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
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Modal showModal={isAddingNewTeam} setShowModal={setIsAddingNewTeam}>
        <Formik
          initialValues={{
            title: '',
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
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    'Create Team'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

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
              <ProjectCard key={project._id} project={project} />
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
