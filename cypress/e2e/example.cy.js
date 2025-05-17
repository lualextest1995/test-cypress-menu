describe('My First Test', () => {
  beforeEach(() => {
    cy.interceptApi({
      url: 'http://localhost:3000/userFunction',
      method: 'GET',
      alias: 'userFunction',
    })
  })

  it('create', function () {
    cy.visit('/')
    cy.wait('@userFunction')
      .its('response.body')
      .then((data) => {
        cy.log('API Response:', data)
        const permissions = data.data.find((item) => item.pageName === 'testPage') ?? {}
        const permissionList = permissions.permissionList ?? []
        cy.wrap(permissionList).as('permissionList')
      })
    cy.get('@permissionList').then((permissionList) => {
      if (!permissionList.includes('create')) {
        cy.log('No create permission')
        this.skip()
      }
    })
    cy.log('繼續測試 create')
  })

  it('read', function () {
    cy.visit('/')
    cy.wait('@userFunction')
      .its('response.body')
      .then((data) => {
        cy.log('API Response:', data)
        const permissions = data.data.find((item) => item.pageName === 'testPage') ?? {}
        const permissionList = permissions.permissionList ?? []
        cy.wrap(permissionList).as('permissionList')
      })
    cy.get('@permissionList').then((permissionList) => {
      if (!permissionList.includes('read')) {
        cy.log('No create permission')
        this.skip()
      }
    })
    cy.log('繼續測試 read')
  })
})
