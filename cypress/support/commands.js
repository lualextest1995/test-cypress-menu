// ***********************************************
// 此 commands.js 範例展示如何
// 建立各種自訂指令與覆寫現有指令。
//
// 更完整的自訂指令範例可參考：
// https://on.cypress.io/custom-commands
// ***********************************************

//
// -- 這是「父指令」（parent command） --
// Cypress.Commands.add('login', (email, password) => { ... })

//
// -- 這是「子指令」（child command） --
// Cypress.Commands.add('drag', { prevSubject: 'element' }, (subject, options) => { ... })

//
// -- 這是「雙指令」（dual command） --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional' }, (subject, options) => { ... })

//
// -- 這是覆寫現有指令的方式 --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// 取得 data-cy 封裝
Cypress.Commands.add('cyGet', (id) => {
  return cy.get(`[data-cy=${id}]`)
})

// element 點擊
Cypress.Commands.add('elementClick', (id) => {
  return cy.cyGet(id).click()
})

// 输入框输入
Cypress.Commands.add('inputValue', (id, value) => {
  return cy.cyGet(id).then(($el) => {
    if ($el.is('input')) {
      cy.wrap($el).focus().clear().type(value)
    } else {
      cy.wrap($el).find('input').focus().clear().type(value)
    }
  })
})

// 下拉選單選擇
Cypress.Commands.add('selectValue', (id, value = null) => {
  cy.elementClick(id)
  cy.get('.el-select__popper')
    .filter(':visible')
    .then(($el) => {
      if ($el.find('.el-select-dropdown__item').length === 0) {
        cy.get('.el-select-dropdown__empty').should('be.visible')
        throw new Error('下拉選單沒有資料')
      } else if (value === null) {
        cy.log('下拉選單沒有傳入值，預設選擇第一個(未完成)')
        // 找到 $el 中的第一個 .el-select-dropdown__item 元素，並點擊
        // cy.log( $el.find( '.el-select-dropdown__item' ).first() )
        cy.wrap($el.find('.el-select-dropdown__item').first()).click()
      } else {
        cy.get('.el-select-dropdown__item').contains(value).should('be.visible').click()
      }
    })
})

// 時間日期區間選擇
Cypress.Commands.add('datePickerValue', (id, value = [0, 6]) => {
  // 待補 input 輸入方式

  cy.elementClick(id)
  cy.get('.el-picker-panel__body .el-date-table td.available').eq(value[0]).click()
  cy.get('.el-picker-panel__body .el-date-table td.available').eq(value[1]).click()
  cy.get('.el-picker-panel__footer .el-button--small').contains('确定').click()
})

// 確認路徑
Cypress.Commands.add('checkUrl', (url) => {
  return cy.url().should('match', new RegExp(`${url}([?#].*)?$`))
})

// 登入
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/')
  cy.checkUrl('/login')
  cy.inputValue('account', username)
  cy.inputValue('password', password)
  cy.elementClick('submit')
  cy.checkUrl('/welcome')
})

// Menu 跳轉頁面
Cypress.Commands.add('menuNavigate', (data = []) => {
  const routes = Array.isArray(data) ? data : [data]
  cy.wrap(routes).each((route) => {
    cy.elementClick(`menu-${route}`)
  })
  cy.checkUrl(routes[routes.length - 1])
})

Cypress.Commands.add('getFirstRowDataElementPlus', (id, name = 'firstRow') => {
  return cy
    .cyGet(id)
    .find('.el-table__header-wrapper .el-table__cell')
    .then(($heads) => {
      const keys = [...$heads].map((el) => Cypress.$(el).text().trim())

      return cy
        .cyGet(id)
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

Cypress.Commands.add('getFirstRowDataBootStrapTable', (id, name = 'firstRow') => {
  return cy
    .cyGet(id)
    .find('thead tr')
    .find('th')
    .then(($heads) => {
      const keys = [...$heads].map((el) => Cypress.$(el).text().trim())

      return cy
        .cyGet(id)
        .find('tbody tr')
        .first()
        .find('td')
        .then(($cell) => {
          const values = [...$cell].map((el) => Cypress.$(el).text().trim())
          const rowData = Object.fromEntries(keys.map((k, i) => [k, values[i]]))
          cy.wrap(rowData).as(name)
          cy.log('Row Data:', rowData)
        })
    })
})

/**
 * 支援 Element Plus 與 BootstrapTable 的首列資料擷取
 *
 * @param {string} id   外層 selector（# 或 .class）
 * @param {string} name alias 名稱，預設 'firstRow'
 *
 * 使用：
 *  cy.getFirstRowData('#myTable')
 *  cy.get('@firstRow').its('使用者').should('eq', 'Alex')
 */
Cypress.Commands.add('getFirstRowData', (id, name = 'firstRow') => {
  return cy.cyGet(id).then(($table) => {
    // --- 定義策略清單 ---------------------------------------
    /** @type {Array<{match: ($t:JQuery)=>boolean, action: ()=>Cypress.Chainable}>} */
    const strategies = [
      {
        // ❶ Element Plus：判斷是否含 .el-table__header-wrapper
        match: ($t) => $t.find('.el-table__header-wrapper').length > 0,
        action: () => cy.getFirstRowDataElementPlus(id, name),
      },
      {
        // ❷ BootstrapTable：這裡示範「thead > tr > th」數量 > 0
        //   你也可以加 .bootstrap-table class 判斷、更精確 selector…
        match: ($t) => $t.find('thead tr th').length > 0,
        action: () => cy.getFirstRowDataBootStrapTable(id, name),
      },
    ]
    // -------------------------------------------------------

    // 找到第一個符合的策略並執行；若都不符合就 throw
    for (const s of strategies) {
      if (s.match($table)) return s.action()
    }
    throw new Error(`[getFirstRowData] 無法識別表格類型：${id}`)
  })
})
