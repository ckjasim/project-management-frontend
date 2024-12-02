{/* <Modal showModal={isAddingNewTeam} setShowModal={setIsAddingNewTeam}>
<Formik
  initialValues={{
    name: '',
    employees: [],
  // }}
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
</Modal> */}