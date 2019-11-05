
let fixtures = {}

// these static 'fixtures' will be used in place of the data that would normally be returned by our axios calls
const init = function() {
  fixtures = {
    days: [
      {
        id: 1,
        name: "Monday",
        appointments: [1, 2],
        interviewers: [1, 2],
        spots: 1
      },
      {
        id: 2,
        name: "Tuesday",
        appointments: [3, 4],
        interviewers: [3, 4],
        spots: 1
      }
    ],
    appointments: {
      "1": { id: 1, time: "12pm", interview: null },
      "2": {
        id: 2,
        time: "1pm",
        interview: { student: "Archie Cohen", interviewer: 2 }
      },
      "3": {
        id: 3,
        time: "2pm",
        interview: { student: "Leopold Silvers", interviewer: 4 }
      },
      "4": { id: 4, time: "3pm", interview: null }
    },
    interviewers: {
      "1": {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      },
      "2": {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png"
      },
      "3": {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      },
      "4": {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg"
      }
    }
  };
}

// replaces the .get, .put, .delete from axios
// mocks the data that would be returned from a real axios call
export default {

  initFixtures(){
    init();
  },

  get: jest.fn(url => {
    
    if (url === "/api/days") {
      return Promise.resolve({
        status: 200,
        statusText: "OK",
        data: fixtures.days
      });
    }

    if (url === "/api/appointments") {
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: fixtures.appointments
      });
    }

    if (url === "/api/interviewers") {
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: fixtures.interviewers
      });
    }
  }),

  put: jest.fn(url => {

    if (url === `/api/appointments/1`) {
    // this mimics my update spots function
    // which is usually called after a succesful axios response
    // but won't work here since it requires making a secondary axios call.
    // I chose to make a secondaty axios call, as this is the most appropriate way 
    // to ensure up-to-date information is being displayed to the user,
    // instead of mimicking the value on the client side.
    // ideally this info would have been sent with the query response
    // but that wasn't how the database was set up
    // thus a secondary call was required
      fixtures.days[0].spots--;
    }

    return Promise.resolve({
      status: 204, 
      statusText: "No Content"
    });
  }),

  delete: jest.fn(url => {

    if (url === `/api/appointments/2`) {
      // same purpose as above
      fixtures.days[0].spots++;
    }

    return Promise.resolve({
      status: 204,
      statusText: "No Content"
    });
  })
}