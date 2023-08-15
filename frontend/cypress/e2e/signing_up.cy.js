describe("Signing up", () => {
  it("with valid credentials, redirects to '/planner'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone@example.com");
    cy.get("#username").type("test_username");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.url().should("include", "/planner");
  });

  it("with missing password, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone@example.com");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });

  it("with missing email, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });
});