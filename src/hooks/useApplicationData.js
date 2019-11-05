
import axios from 'axios';

import { useReducer, useEffect, useRef } from "react";

import reducer from "reducers/application";
import actions from 'reducers/constants';

export default function () {

  // custom hooks are the properties within the reducer
  const [state, dispatch] = useReducer(reducer, { // sets all the state properties of application into a single object
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: actions.SET_DAY, value: day });

  // useEffect hook
  useEffect(() => { // this will only run once due to the empty dependency array
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({ type: actions.SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
    })
      .catch((e) => {});
  }, []);
  const socket = useRef();

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:8001');
  }, []);

  function updateSpots() {
    // I chose to make a secondaty axios call, as this is the most appropriate way 
    // to ensure up-to-date information is being displayed to the user,
    // instead of mimicking the value on the client side.
    // ideally this info would have been sent with the query response
    // but that wasn't how the database was set up
    // thus a secondary call was required
    axios.get('/api/days')
      .then(res => {
        dispatch({ type: actions.SET_APPLICATION_DATA, value: { days: res.data } })
      })
      .catch((e) => {
      });
  }

  // functions for changing components
  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    dispatch({ type: actions.SET_APPOINTMENTS, value: appointments });

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        updateSpots();
      })
  }

  function cancelInterview(id) {

      // set appointment's interview data to null
    state.appointments[id].interview = null;

    dispatch({ type: actions.SET_APPOINTMENTS, value: state.appointments });

    return axios.delete(`/api/appointments/${id}`).then(() => updateSpots())
  }

  return ({
    state,
    setDay,
    bookInterview,
    cancelInterview
  });
}