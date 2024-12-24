import { TeamSelect } from '@/components/project/teamSelect';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as Yup from 'yup';
import { createMeetingApi } from '@/services/api/api';

const MeetingSheduleForm = ({meetings,setMeetings,setTeams ,teams}) => {
    function randomID(len) {
      let result = '';
      if (result) return result;
      var chars =
          '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
      len = len || 5;
      for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return result;
    }
  
  return (
    <div>
          <Formik
                initialValues={{
                  title: '',
                  date: '',
                  time: '',
                  duration: '',
                  teams: [],
                }}
                validationSchema={Yup.object({
                  title: Yup.string().required('Meeting title is required'),
                  date: Yup.date().required('Date is required'),
                  time: Yup.string().required('Time is required'),
                  duration: Yup.string().required('Duration is required'),
                  teams: Yup.array().min(1, 'Select at least one team'),
                })}
                onSubmit={async (values, { resetForm }) => {
                  const meetingDate = new Date(values.date);
                  const [hours, minutes] = values.time.split(':');
                  meetingDate.setHours(parseInt(hours), parseInt(minutes));
                  const roomID = randomID(5);
                  const meetingLink =
                    //   window.location.protocol + '//' +
                    //  window.location.host + window.location.pathname +
                    '?roomID=' + roomID;
                  const newMeeting = {
                    id: meetings.length + 1,
                    title: values.title,
                    date: meetingDate,
                    time: meetingDate?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    meetingLink,
                    teams: values.teams.map(
                      (id) => teams.find((t) => t.id === id)?.id || ''
                    ),
                    duration: values.duration,
                  };

                  const res = await createMeetingApi(newMeeting);
                  console.log(res, '================');
                  setMeetings([...meetings, newMeeting]);
                  resetForm();
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-gray-700">
                        Meeting Title
                      </Label>
                      <Field
                        id="title"
                        name="title"
                        as={Input}
                        placeholder="Enter meeting title"
                        className=" w-full px-4 py-3  border-slate-200 bg-slate-50/99
                               focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                               transition-all placeholder:text-gray-400"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="mt-1 text-rose-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-gray-700">
                          Date
                        </Label>
                        <Field
                          id="date"
                          name="date"
                          type="date"
                          as={Input}
                          className="mt-1 w-full px-4 py-3 rounded-xl border-slate-200 
                                 bg-slate-50/99 focus:border-indigo-500 focus:ring-1 
                                 focus:ring-indigo-500 transition-all"
                        />
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="mt-1 text-rose-500 text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time" className="text-gray-700">
                          Time
                        </Label>
                        <Field
                          id="time"
                          name="time"
                          type="time"
                          as={Input}
                          className="mt-1 w-full px-4 py-3 rounded-xl border-slate-200 
                                 bg-slate-50/99 focus:border-indigo-500 focus:ring-1
                                 focus:ring-indigo-500 transition-all"
                        />
                        <ErrorMessage
                          name="time"
                          component="div"
                          className="mt-1 text-rose-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration" className="text-gray-700">
                        Duration
                      </Label>
                      <Field
                        id="duration"
                        name="duration"
                        as={Input}
                        placeholder="e.g., 30 mins, 1 hour"
                        className="mt-1 w-full px-4 py-3 rounded-xl border-slate-200 
                               bg-slate-50/50 focus:border-indigo-500 focus:ring-1 
                               focus:ring-indigo-500 transition-all placeholder:text-gray-400"
                      />
                      <ErrorMessage
                        name="duration"
                        component="div"
                        className="mt-1 text-rose-500 text-sm"
                      />
                    </div>

                    <TeamSelect
                      values={values}
                      setFieldValue={setFieldValue}
                      teams={teams}
                      setTeams={setTeams}
                    />
                    <ErrorMessage
                      name="teams"
                      component="div"
                      className="mt-1 text-rose-500 text-sm"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 
                             hover:from-indigo-700 hover:to-indigo-600 text-white font-medium 
                             py-3 rounded-xl transition-all duration-200 shadow-lg 
                             shadow-indigo-500/20 hover:shadow-indigo-500/30
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Schedule Meeting
                    </button>
                  </Form>
                )}
              </Formik>
    </div>
  )
}

export default MeetingSheduleForm
