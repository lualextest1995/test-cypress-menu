// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.getFirstRowData('[data-cy="el-table"]', 'el-table-firstRow')
    cy.get('@el-table-firstRow').then((rowData) => {
      cy.log('Row Data from alias:', rowData)
      expect(rowData).to.have.property('Date')
      expect(rowData).to.have.property('Name')
      expect(rowData).to.have.property('Address')

      cy.get('[data-cy="input"]').type(rowData.Name)
    })
  })
})
