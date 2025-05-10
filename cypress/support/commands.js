// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getFirstRowData', (id, name = 'firstRow') => {
  return cy
    .get(id)
    .find('.el-table__header-wrapper .el-table__cell')
    .then(($heads) => {
      const keys = [...$heads].map((el) => Cypress.$(el).text().trim())

      return cy
        .get(id)
        .find('.el-table__body-wrapper .el-table__row')
        .first()
        .find('.el-table__cell')
        .then(($cell) => {
          const values = [...$cell].map((el) => Cypress.$(el).text().trim())
          const rowData = Object.fromEntries(keys.map((k, i) => [k, values[i]]))
          cy.wrap(rowData).as(name)
          cy.log('Row Data:', rowData)
        })
    })
})
