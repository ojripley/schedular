import React, { useState, useEffect } from "react";
import axios from 'axios';

// selectors
import { getAppointmentsForDay, getInterview } from 'helpers/selectors';

// components
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";

export default function Application(props) {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
    mode: ''
  })

  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}));  // this is now done with setState and state.days

  useEffect(() => { // this will only run once due to the empty dependency array
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })   
  }, []);

  const appointments = getAppointmentsForDay(state, state.day);
  const schedule = appointments.map((appointment) => { // schedule is called within the main return itself to generate a list of appointments
    const interview = getInterview(state, appointment.interview);

    return (

      < Appointment
        key={appointment.id}
        {...appointment} // spreaaaaad
        // id={appointment.id}
        // time={appointment.time}
        interview={interview}
      />

  )});

  // everything within this return statement will be rendered. React will only rerender the parts that need to be changed however 
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}


