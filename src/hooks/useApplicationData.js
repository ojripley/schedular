
import axios from 'axios';
import { useReducer, useEffect } from "react";

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
        return {...state, appointments: action.value}
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
      dispatch({ type: SET_APPLICATION_DATA, value: {days: all[0].data, appointments: all[1].data, interviewers: all[2].data }})
      // setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  // updates spots
  useEffect(() => {
    axios.get('/api/days')
    .then(res => dispatch({ type: SET_DAYS, value: res.data }));
  }, [state.days]);

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

    dispatch({ type: SET_APPOINTMENTS, value: appointments });

    return axios.put(`/api/appointments/${id}`, appointment);//.then(() => updateSpots(id, -1));
  }

  function cancelInterview(id) {

    // if the appointment exists
    if (state.appointments[id]) {
      // set it's interview data to null
      state.appointments[id].interview = null;
    }
    return axios.delete(`/api/appointments/${id}`);//.then(() => updateSpots(id, 1));
  }

  // this is an alternative to updating spots in a day.
  // however, it requires changing how i differentiate between edit mode and create mode
  // function updateSpots(id, crement) {
  //   const day = Math.floor(id / 5);

  //   state.days[day].spots += crement;

  //   dispatch({ type: SET_DAYS, value: state.days });
  // }

  return ({
    state,
    setDay,
    bookInterview,
    cancelInterview
  });
}