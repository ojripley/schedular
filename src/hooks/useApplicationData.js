
import axios from 'axios';
import { useReducer, useEffect, useRef } from "react";

export default function(){

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_APPOINTMENTS = "SET_APPOINTMENTS";
  const SET_DAYS = "SET_DAYS";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value }
      case SET_APPOINTMENTS: {

        // if (!action.value.interview === null) {

        // } else {

        // }

        const appointment = {
          ...state.appointments[action.value.id],
          interview: action.value.interview && { ...action.value.interview }
        };

        console.log();

        const appointments = {
          ...state.appointments,
          [action.value.id]: appointment
        };

        console.log(appointments);

        return {...state, appointments: appointments}
      }
      case SET_DAYS: {
        return {...state, days: action.value}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  
  // custom hooks are the properties within the reducer
  const [state, dispatch] = useReducer(reducer, { // sets all the state properties of application into a single object
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({type: SET_DAY, value: day});
  // const setDays = days => setState(prev => ({...prev, days}));  // this is now done with setState and state.days

  // useEffect hook
  useEffect(() => { // this will only run once due to the empty dependency array
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } })
      // setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);
  const socket = useRef();

  useEffect(() => {
    socket.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  }, []);

  useEffect(() => {

    socket.current.onopen = () => {
      console.log('Connected to server.');
      socket.current.send('ping');
      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log('from server: ', data);

        if (data.type === 'SET_INTERVIEW') {
          console.log('update an appointment with id: ', data.id);

          dispatch({type: SET_APPOINTMENTS, value: data});
        }
      }
    }

    socket.current.onclose = () => console.log('Disconnect from server');

    return () => {
      socket.current.close()
    }
  }, []);

  function updateSpots() {
    axios.get('/api/days')
    .then(res => dispatch({ type: SET_APPLICATION_DATA, value: {days: res.data }}));
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

    // dispatch({ type: SET_APPOINTMENTS, value: appointments });

    return axios.put(`/api/appointments/${id}`, appointment).then(() => updateSpots());
  }

  function cancelInterview(id) {

    // if the appointment exists
    if (state.appointments[id]) {
      // set it's interview data to null
      state.appointments[id].interview = null;
    }

    // dispatch({ type: SET_APPOINTMENTS, value: state.appointments });

    return axios.delete(`/api/appointments/${id}`).then(() => updateSpots());
  }

  return ({
    state,
    setDay,
    bookInterview,
    cancelInterview
  });
}