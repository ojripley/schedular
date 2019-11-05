describe('Appointment', () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit('/');
    cy.contains('Monday');
  });
  it('should book an interview', () => {
    
    cy.get('[alt=Add]')
      .first() // the first element that matches the get query
      .click();

    cy.get('[data-testid=student-name-input]')
      .type('Lydia Miller-Jones');

    cy.get("[alt='Sylvia Palmer']")
      .click();

    cy.contains('Save')
      .click();

    cy.contains('.appointment__card--show', 'Sylvia Palmer');
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');

  });

  it('should edit an interview', () => {   
    cy.get('[alt=Edit]')
      .first() // the first element that matches the get query
      .click({ force: true });

    cy.get('[data-testid=student-name-input]')
      .clear()
      .type('Lydia Miller-Jones');

    cy.get("[alt='Tori Malcolm']")
      .click();

    cy.contains('Save')
      .click();

      cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
      cy.contains('.appointment__card--show', 'Tori Malcolm');
  });

  it('should cancel an interview', () => {
    cy.get('[alt=Delete]')
      .first() // the first element that matches the get query
      .click({ force: true });

    cy.contains('Confirm')
      .click();

    cy.contains('deleting');

    cy.contains('.appointment__card--show', 'Archie Cohen')
      .should('not.exist');
  });
});