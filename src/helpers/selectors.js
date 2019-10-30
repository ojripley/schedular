export function getAppointmentsForDay(state, dayName) {

  const dayByName = state.days.filter((d) => d.name === dayName);

  const appointmentsByDay = [];

  if (dayByName[0] &&  dayByName[0].appointments) {
    for (let appointment of dayByName[0].appointments) {
      if (state.appointments[appointment]) {
        appointmentsByDay.push(state.appointments[appointment]);
      }
    }
  }
  return appointmentsByDay;
}

export function getInterview(state, interview) {

  let interviewObj = null;

  if (interview) {
    interviewObj = {...interview, interviewer: state.interviewers[interview.interviewer]};
  }
  return interviewObj;
}

export function getInterviewersForDay(state, dayName) {
  const dayByName = state.days.filter((d) => d.name === dayName);

  const interviewersByDay = [];

  if (dayByName[0] && dayByName[0].appointments) {
    for (let interviewer of dayByName[0].interviewers) {
      if (state.interviewers[interviewer]) {
        interviewersByDay.push(state.interviewers[interviewer]);
      }
    }
  }
  return interviewersByDay;
}