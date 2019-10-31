import React from 'react';
import './styles.scss';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

// custom hooks
import useVisualMode from 'hooks/useVisualMode';

// hook modes
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';


export default function Appointment(props) {
  
  // appointmnet view will be different depending on mode
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  
  // save funciton passed to form for onSave
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    }).catch((e) => {
      // true will replace the SAVING state in history
      // this way we can go back properly
      transition(ERROR_SAVE, true);
    });
  }

  function deleteInterview() {

    transition(DELETING, true);

    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY);
    }).catch((e) => {
      console.error(e);
      transition(ERROR_DELETE, true);
    });


  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}  />}
      {mode === SHOW && <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer.name}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(CREATE)}
      />}
      {mode === CREATE && <Form
        name={props.interview ? props.interview.student : ''}
        interviewers={props.interviewers}
        interviewer={props.interview ? props.interview.interviewer.id : null}
        onSave={save}
        onCancel={() => back()}
      />}
      {mode === SAVING && <Status status='saving'/>}
      {mode === DELETING && <Status status='deleting'/>}
      {mode === CONFIRM && <Confirm 
        onCancel={() => back ()}
        onConfirm={deleteInterview}
      />}
      {mode === ERROR_DELETE && <Error 
        message='Could not delete.'
        onClose={() => back()}
      />}
      {mode === ERROR_SAVE && <Error
        message='Could not save.'
        onClose={() => back()}
      />}
    </article>
  );
}