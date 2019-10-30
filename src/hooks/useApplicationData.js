
import axios from 'axios';
import { useState, useEffect } from "react";

export default function useApplicationData() {

  // custom hooks are the properties within the hook object
  const [state, setState] = useState({ // sets all the state properties of application into a single object
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({...prev, days}));  // this is now done with setState and state.days

  // useEffect hook
  useEffect(() => { // this will only run once due to the empty dependency array
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);


  // functions for changing components
  function bookInterview(id, interview) {
    console.log(id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState({ ...state, appointments });

    return axios.put(`/api/appointments/${id}`, appointment);
  }


  function cancelInterview(id, interview) {

    // if the appointment exists
    if (state.appointments[id]) {
      // set it's interview data to null
      state.appointments[id].interview = null;
    }
    return axios.delete(`/api/appointments/${id}`);
  }



}
