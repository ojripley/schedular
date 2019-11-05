import React from "react";

import axios from 'axios';

import { render, cleanup, waitForElement, fireEvent, getByText, getByAltText, prettyDOM, getAllByTestId, getByPlaceholderText, waitForElementToBeRemoved, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";


// rendering the application gets us 71% code coverage... but that is a bit of a false positive
// skipping this test allows us to write more explicit tests
// xit("renders without crashing", () => {
//   render(<Application />);
// });

describe('Application', () => {

  beforeEach(() => {
    cleanup();
    axios.initFixtures()
  });

  it('defaults to Monday and changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: 'Lydia Miller-Jones'}});

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, 'Delete the appointment?')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'deleting')).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });

  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    expect(getByText(appointment, 'Save')).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: 'Bob' } });

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Bob'));
    
    expect(getByText(appointment, 'Bob')).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: 'Bob' } });

    expect(getByText(appointment, 'Save')).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Save"));

    expect(getByText(appointment, 'saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Could not save.'));

    expect(getByText(appointment, 'Could not save.')).toBeInTheDocument();

  });

  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    fireEvent.click(queryByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'deleting')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Could not delete.'));

    expect(getByText(appointment, 'Could not delete.')).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, 'Close'));
  });
});