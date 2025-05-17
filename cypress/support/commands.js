// 取得 data-cy 封裝
Cypress.Commands.add('cyGet', (id) => {
  return cy.get(`[data-cy="${id}"]`)
})

// element 點擊
Cypress.Commands.add('elementClick', (id) => {
  return cy.cyGet(id).click()
})

// 打 API
Cypress.Commands.add('interceptApi', (opts) => {
  const { url, method = 'GET', body, alias } = opts

  if (!url || !alias) {
    cy.log('interceptApi: url 與 alias 為必填')
    return cy.wrap(null)
  }

  const args = body === undefined ? [method, url] : [method, url, body]
  return cy.intercept(...args).as(alias)
})

// 取得 API 回傳資料（支援任意路徑）
Cypress.Commands.add('getInterceptData', (alias, path = 'response.body') => {
  return cy.wait(`@${alias}`).its(path)
})

// 输入框输入
Cypress.Commands.add('inputValue', (id, value) => {
  cy.cyGet(id)
    .should('exist')
    .then(($el) => {
      const input = $el.is('input') ? cy.wrap($el) : cy.wrap($el).find('input')
      input.clear().focus().type(value)
    })
})

// 下拉選單選擇
Cypress.Commands.add('selectValue', (id, value = null) => {
  cy.elementClick(id)
  cy.cyGet(id)
    .find('div[aria-describedby]')
    .first()
    .invoke('attr', 'aria-describedby')
    .then((panelId) => {
      cy.get(`#${panelId}`)
        .should('be.visible')
        .within(() => {
          if (value === null) {
            cy.get('.el-select-dropdown__item').should('have.length.gt', 0).first().click()
          } else {
            cy.get('.el-select-dropdown__item').contains(value).click()
          }
        })
    })
})

// 時間日期區間選擇
Cypress.Commands.add('datePickerValue', (id, value = []) => {
  if (!Array.isArray(value)) value = [value]
  cy.cyGet(id)
    .find('input')
    .each(($input, index) => {
      cy.wrap($input).clear().focus().type(value[index])
      if (index === value.length - 1) cy.wrap($input).blur()
    })
})

// 確認路徑
Cypress.Commands.add('checkUrl', (url) => {
  return cy.url().should('match', new RegExp(`${url}([?#].*)?$`))
})

// 確認 API 狀態碼
Cypress.Commands.add('expectStatusCode', (alias, statusCodes) => {
  const statusCodeArray = Array.isArray(statusCodes) ? statusCodes : [statusCodes]
  return cy.getInterceptData(alias, 'response.statusCode').should('be.oneOf', statusCodeArray)
})

// 登入
Cypress.Commands.add('loginWithSession', (username, password) => {
  cy.interceptApi({
    url: '/api/login*',
    method: 'POST',
    alias: 'login',
  })
  cy.interceptApi({
    url: '/api/userInfo*',
    method: 'GET',
    alias: 'userInfo',
  })
  cy.interceptApi({
    url: '/api/userFunction',
    method: 'GET',
    alias: 'userFunction',
  })
  cy.session([username, password], () => {
    cy.visit('/')
    cy.checkUrl('/login')
    cy.inputValue('account', username)
    cy.inputValue('password', password)
    cy.elementClick('submit')
    cy.expectStatusCode('login', 200)
    cy.expectStatusCode('userInfo', 200)
    cy.expectStatusCode('userFunction', [200, 304])
    cy.checkUrl('/welcome')
  })
})

// Menu 跳轉頁面
Cypress.Commands.add('menuNavigate', (routes = []) => {
  const pathArray = Array.isArray(routes) ? routes : [routes]
  cy.wrap(pathArray).each((route) => {
    cy.elementClick(`menu-${route}`)
    cy.cyGet(`menu-${route}`).should('have.class', 'is-active')
  })
  cy.checkUrl(pathArray[pathArray.length - 1])
})

// 取得所有權限
Cypress.Commands.add('getPagePermissions', (pageName) => {
  cy.interceptApi({
    url: '/api/userFunction',
    method: 'GET',
    alias: 'userFunction',
  })
  cy.getInterceptData('userFunction', 'response').then((res) => {
    expect(res.statusCode).to.be.oneOf([200, 304])
    // 取得該頁所有權限
    const permissions = res.body.find((item) => item.pageName === pageName) ?? {}
    const permissionList = permissions.permissionList ?? []
    cy.wrap(permissionList).as('permissionList')
  })
})
