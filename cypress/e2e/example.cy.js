// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.getFirstRowData('el-table', 'el-table-firstRow')
    cy.get('@el-table-firstRow').then((rowData) => {
      cy.log('Row Data from alias:', rowData)
      expect(rowData).to.have.property('Date')
      expect(rowData).to.have.property('Name')
      expect(rowData).to.have.property('Address')
      cy.inputValue('input', rowData.Name)
    })

    cy.getFirstRowData('bootStrapTable', 'bootStrapTable-firstRow1')
    cy.get('@bootStrapTable-firstRow1').then((rowData) => {
      cy.log('Row Data from alias:', rowData)
      expect(rowData).to.have.property('Item ID')
      expect(rowData).to.have.property('Item Name')
      expect(rowData).to.have.property('Item Price')
      cy.inputValue('input1', rowData['Item ID'])
    })
  })
})
