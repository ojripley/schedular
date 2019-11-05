import React from "react";

import './DayListItem.scss';
import classNames from 'classnames';

export default function DayListItem(props) {

  function formatSpots() {
    if (props.spots === 0) {
      return 'no spots remaining';
    }

    if (props.spots === 1) {
      return '1 spot remaining';
    }

    if (props.spots > 1) {
      return `${props.spots} spots remaining`;
    }
  }

  let dayClass = classNames('day-list__item', {
    ' day-list__item--selected': props.selected,
    ' day-list__item--full': props.spots === 0
  });

  return (
    <li data-testid="day" className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}
