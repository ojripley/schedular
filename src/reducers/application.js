
import actions from './constants';

export default function reducer(state, action) {
  switch (action.type) {
    case actions.SET_DAY:
      return { ...state, day: action.value }
    case actions.SET_APPLICATION_DATA:
      return { ...state, ...action.value }
    case actions.SET_APPOINTMENTS: {
      return { ...state, appointments: action.value }
    }
    case actions.SET_DAYS: {
      return { ...state, days: action.value }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}