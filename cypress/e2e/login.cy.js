import users from '../fixtures/users.json'
const newPassword = 'newPassword123'

const loginFlow = (account, password, captcha = null) => {
  cy.inputValue('account', account)
  cy.inputValue('password', password)
  if (captcha) {
    cy.inputValue('captcha', captcha)
  }
  cy.elementClick('submit')
}

const validateResponse = () => {
  cy.getInterceptData('login', 'response').then((res) => {
    expect(res.statusCode).to.equal(200)
  })
  cy.getInterceptData('userInfo', 'response').then((res) => {
    expect(res.statusCode).to.equal(200)
    cy.wrap(res.body.data.isInitPwd).as('isInitPwd')
    cy.wrap(res.body.data.have2FA).as('have2FA')
  })
}
const changePasswordIfRequired = (oldPassword, newPassword, expectError = false) => {
  cy.get('@isInitPwd').then((isInitPwd) => {
    if (!isInitPwd) return
    if (expectError) {
      cy.inputValue('oldPassword', oldPassword)
      cy.inputValue('newPassword', oldPassword)
      cy.inputValue('confirmNewPassword', oldPassword)
      // 驗證錯誤提示(待補)
    }
    cy.inputValue('oldPassword', oldPassword)
    cy.inputValue('newPassword', newPassword)
    cy.inputValue('confirmNewPassword', newPassword)
    cy.elementClick('change-password-confirm')
    // 驗證修改密碼 API(待補)
    loginFlow('account', newPassword)
    validateResponse()
  })
}
const handle2FAIfRequired = () => {
  cy.get('@have2FA').then((have2FA) => {
    if (have2FA) {
      cy.inputValue('otp', '123456')
      cy.elementClick('submit')
      // 驗證2FA API(待補)
    }
  })
}

describe('登入流程（四組帳號 + 2FA 開關）', () => {
  beforeEach(() => {
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
    cy.visit('/')
    cy.checkUrl('/login')
  })

  users.forEach((user) => {
    const { role, username, password } = user
    it(`登入 ${role} (${username})`, () => {
      // 1.先輸入錯誤的帳號密碼，觸發驗證碼及錯誤提示
      loginFlow('wrongUsername', 'wrongPassword')
      // 驗證錯誤提示(待補)
      // 2.輸入正確的帳號密碼
      loginFlow(username, password, '123456')
      validateResponse()
      // 3.如果是首次登入，則需要修改密碼
      changePasswordIfRequired(password, newPassword, true)
      // 4.如果有 2FA，則輸入 OTP 驗證碼
      handle2FAIfRequired()
      // 5.驗證登入成功
      cy.checkUrl('/welcome')
    })
  })
})
