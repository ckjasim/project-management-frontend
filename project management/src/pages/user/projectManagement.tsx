import React, { useState } from 'react';
import { PlusCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Modal from '@/components/global/Modal/Modal';
import { Input } from '@/components/ui/input';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';

const ProjectDashboard = () => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isAddingNewTeam, setIsAddingNewTeam] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid title')
      .required('Title is required'),
    summary: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid summary')
      .required('Summary is required'),
    description: Yup.string(),
    dueDate: Yup.date().required('Due date is required').nullable(),
    team: Yup.string(),
    priority: Yup.string()
  });

  const projects = [
    {
      id: 1,
      icon: '🎨',
      title: 'Premium Support',
      description:
        'Pink is obviously a better color. Everyone born confident and everything taken away.',
      participants: 23,
      dueDate: '07.08.22',
      status: 'completed',
      avatars: ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻'],
    },
    {
      id: 2,
      icon: '⚡',
      title: 'Design Tools',
      description:
        "Constantly growing. We're constantly making mistakes from which we learn and improve",
      participants: 10,
      dueDate: '02.08.22',
      status: 'overdue',
      avatars: ['👨‍🎨', '👩‍🎨', '👨‍💻'],
    },
    {
      id: 3,
      icon: '💼',
      title: 'Developer First',
      description:
        'For standing out. But the time is now to be okay to be the greatest you.',
      participants: 30,
      dueDate: '20.08.22',
      status: 'active',
      avatars: ['👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼'],
    },
  ];

  const teams = ['Team A', 'Team B', 'Team C'];

  const onAddProject = async (values, { setSubmitting }) => {
    try {
      // Add your project creation logic here
      console.log('Creating project:', values);
      setShowAddProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const onAddTeam = async (values, { setSubmitting }) => {
    try {
      // Add your team creation logic here
      console.log('Creating team:', values);
      setIsAddingNewTeam(false);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamChange = (e) => {
    const value = e.target.value;
    if (value === 'addNew') {
      setIsAddingNewTeam(true);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Project Creation Modal */}
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
            priority: ''
          }}
          validationSchema={validationSchema}
          onSubmit={onAddProject}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-full items-center p-6 gap-y-6">
              <h1 className="text-gray-800 text-3xl font-bold mb-4">
                Create Project
              </h1>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="title" className="text-gray-600 font-medium">
                  Title
                </label>
                <Field
                  name="title"
                  type="text"
                  as={Input}
                  placeholder="Enter project title"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="summary" className="text-gray-600 font-medium">
                  Summary
                </label>
                <Field
                  name="summary"
                  type="text"
                  as={Input}
                  placeholder="Enter project summary"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="summary"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="description" className="text-gray-600 font-medium">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Enter project description"
                  className="w-full px-4 py-2 border rounded-md h-24"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="team" className="text-gray-600 font-medium">
                  Set a team
                </label>
                <Field
                  as="select"
                  name="team"
                  onChange={handleTeamChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                  <option value="addNew">+ Add New Team</option>
                </Field>
                <ErrorMessage
                  name="team"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="priority" className="text-gray-600 font-medium">
                  Priority
                </label>
                <Field
                  name="priority"
                  type="text"
                  as={Input}
                  placeholder="urgent"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="dueDate" className="text-gray-600 font-medium">
                  Due Date
                </label>
                <Field
                  name="dueDate"
                  type="date"
                  as={Input}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Team Creation Modal */}
      <Modal showModal={isAddingNewTeam} setShowModal={setIsAddingNewTeam}>
        <Formik
          initialValues={{
            title: '',
            summary: '',
            description: '',
            dueDate: '',
          }}
          validationSchema={validationSchema}
          onSubmit={onAddTeam}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-full items-center p-6 gap-y-6">
              <h1 className="text-gray-800 text-3xl font-bold mb-4">Create Team</h1>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="title" className="text-gray-600 font-medium">Title</label>
                <Field
                  name="title"
                  type="text"
                  as={Input}
                  placeholder="Enter team name"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="summary" className="text-gray-600 font-medium">Summary</label>
                <Field
                  name="summary"
                  type="text"
                  as={Input}
                  placeholder="Enter team summary"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="summary"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="description" className="text-gray-600 font-medium">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Enter team description"
                  className="w-full px-4 py-2 border rounded-md h-24"
                />
              </div>
              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => setShowAddProjectModal(true)}
        >
          <PlusCircle className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => setShowAddProjectModal(true)}
        >
          <CardContent className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                New project
              </h3>
              <p className="text-gray-400 text-sm">
                Click to create a new project
              </p>
            </div>
          </CardContent>
        </Card>

        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {project.title}
                    </h3>
                    <div className="flex -space-x-2 mt-2">
                      {project.avatars.map((avatar, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm border-2 border-white"
                        >
                          {avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {project.participants} Participants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {project.status === 'completed' && (
                    <span className="text-green-500 text-xs font-medium">
                      Completed
                    </span>
                  )}
                  {project.status === 'overdue' && (
                    <span className="text-red-500 text-xs font-medium">
                      Due date over
                    </span>
                  )}
                  <span className="text-gray-500">{project.dueDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectDashboard;