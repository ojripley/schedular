import React from 'react';

// selectors
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from 'helpers/selectors';

// style
import "components/Application.scss";

// components
import DayList from "./DayList";
import Appointment from "components/Appointment";

// hook
import useApplicationData from 'hooks/useApplicationData';

// sets the initial state equal to the output of the hook defined in useApplicationData
export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map((appointment) => { // schedule is called within the main return itself to generate a list of appointments
    const interview = getInterview(state, appointment.interview);
    return ( // returns an appointment component for every appointment. a schedule array of appointments is generated from that

      < Appointment
        key={appointment.id}
        {...appointment} // spreaaaaad
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
  )});
 
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
