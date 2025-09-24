describe("Films CRUD", () => {
  const filmTitle = "Cypress Test Film";
  const updatedTitle = "Cypress Test Film (updated)";

  beforeEach(() => {
    // Login via UI
    cy.visit("http://localhost:3000/auth/login");

    cy.get('input[name="username"]').type("Tom");
    cy.get('input[name="password"]').type("Tom");
    cy.get("form").submit();

    // Controleer dat login gelukt is
    cy.contains("Welkom").should("exist");

    // Ga daarna naar films pagina
    cy.visit("http://localhost:3000/films");

    // Wacht tot de films tabel volledig geladen is
    cy.get('[data-cy="films-table"]').should("exist");
  });

  it("Kan een nieuwe film aanmaken", () => {
    cy.get('[data-cy="add-film"]').click();

    cy.get('input[name="title"]').type(filmTitle);
    cy.get('textarea[name="description"]').type(
      "Automatisch toegevoegd door Cypress."
    );
    cy.get('input[name="release_year"]').type("2025");
    cy.get('select[name="language_id"]').select("1"); // pas dit aan naar jouw DB

    cy.get("form").submit();

    // Wacht op redirect naar films pagina en controleer nieuwe film
    cy.url().should("include", "/films");
    cy.get('[data-cy="films-table"]').should("exist");
    cy.contains(filmTitle).should("exist");
  });

  it("Kan een film bekijken (read)", () => {
    // Zoek de juiste filmrij en klik "Bekijk"
    cy.get('[data-cy="films-table"]')
      .contains(filmTitle)
      .closest("tr")
      .within(() => {
        cy.get('[data-cy="view-film"]').click();
      });

    // Controleer dat de detailpagina correct is
    cy.get("h1").should("contain", filmTitle);
    cy.contains("Release Year").should("exist");
  });

  it("Kan een film updaten", () => {
    cy.get('[data-cy="films-table"]')
      .contains(filmTitle)
      .closest("tr")
      .within(() => {
        cy.get('[data-cy="edit-film"]').click();
      });

    cy.get('input[name="title"]').clear().type(updatedTitle);
    cy.get("form").submit();

    cy.url().should("include", "/films");
    cy.get('[data-cy="films-table"]').should("exist");
    cy.contains(updatedTitle).should("exist");
  });

  it("Kan een film verwijderen", () => {
    cy.get('[data-cy="films-table"]')
      .contains(updatedTitle)
      .closest("tr")
      .within(() => {
        cy.get('[data-cy="delete-film"]').click();
      });

    // Bevestig confirm dialog
    cy.on("window:confirm", () => true);

    cy.get('[data-cy="films-table"]').should("exist");
    cy.contains(updatedTitle).should("not.exist");
  });
});
