describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it('finds a day with text Tuesday and clicks on it', () => {
    cy.visit('/')
      // .get('li')
      .contains('[data-testid=day]', 'Tuesday') 
      .click()
      .should("have.class", "day-list__item--selected");

    // cy.contains('li', 'Tuesday') // selects the actual li element and not the h2 of Tuesday
    // .should("have.css", "background-color", "rgb(242, 242, 242)");
  });
});
