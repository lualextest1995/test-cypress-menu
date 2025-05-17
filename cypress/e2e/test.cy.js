import permissionsTable from '../fixtures/permissions.json'

const curentModule = 'firstModule'
const curentPage = 'firstPage'
const rolePermissions = Object.entries(permissionsTable).reduce((acc, [role, info]) => {
  const pagePermessions = info?.[curentModule]?.[curentPage] ?? []
  acc[role] = pagePermessions
  return acc
}, {})

const createItFactory = (permissions, strategy) => {
  for (const role in permissions) {
    const roleName = role === 'developer' ? '開發商' : '代理商'
    describe(roleName, () => {
      const permList = permissions[role]
      for (const permission of permList) {
        const scenario = strategy[role]?.[permission]
        if (scenario) {
          it(`【${roleName}】${scenario.title}`, () => {
            scenario.run()
          })
        } else {
          it.skip(`【${roleName}】${permission} 未定義測試案例`, () => {})
        }
      }
    })
  }
}

const scenariosMap = {
  developer: {
    create: {
      title: 'Create 測試',
      run: () => {
        cy.log('開發商 Create 測試')
      },
    },
    read: {
      title: 'Read 測試',
      run: () => {
        cy.log('開發商 Read 測試')
        cy.log('開發商 Read 測試')
      },
    },
    update: {
      title: 'Update 測試',
      run: () => {
        cy.log('開發商 Update 測試')
      },
    },
    delete: {
      title: 'Delete 測試',
      run: () => {
        cy.log('開發商 Delete 測試')
      },
    },
  },
  agent: {
    read: {
      title: 'Read 測試',
      run: () => {
        cy.log('代理商 Read 測試')
      },
    },
  },
}

describe('firstModule - firstPage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  createItFactory(rolePermissions, scenariosMap)
})
