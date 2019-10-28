import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

export default function InterviewerListItem(props) {

  let interviewClass = classNames('interviewers__item', {
    ' interviewers__item--selected': props.selected
  });

  return (
    <li className={interviewClass} onClick={props.setInterviewer}>
      <img
        className='interviewers__item-image'
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}


// html from compass

// <li className="interviewers__item">
//   <img
//     className="interviewers__item-image"
//     src="https://i.imgur.com/LpaY82x.png"
//     alt="Sylvia Palmer"
//   />
//   Sylvia Palmer
// </li>
