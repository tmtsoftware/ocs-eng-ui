import userEvent from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../src/containers/app/App'
import Routes from '../../src/routes'
import RoutesConfig from '../../src/routes/RoutesConfig'
import { screen, renderWithAuth, cleanup } from '../utils/test-utils'

const renderWithRouter = (ui: React.ReactElement) => {
  window.history.pushState({}, 'Home page', RoutesConfig.home)
  return renderWithAuth({ ui: <BrowserRouter>{ui}</BrowserRouter> })
}

const leftClick = { button: 0 }
describe('Full app navigation', () => {
  afterEach(() => {
    cleanup()
  })

  it('Infrastructure route | ESW-441', () => {
    renderWithRouter(
      <App>
        <Routes />
      </App>
    )

    const manageInfra = screen.getByRole('ManageInfrastructure')
    expect(manageInfra).to.exist

    userEvent.click(manageInfra, leftClick)
    expect(window.location.pathname).equal('/Infrastructure')
  })

  it('Observations route | ESW-441', () => {
    renderWithRouter(
      <App>
        <Routes />
      </App>
    )

    const manageObservations = screen.getByRole('ManageObservations')
    expect(manageObservations).to.exist

    userEvent.click(manageObservations, leftClick)
    expect(window.location.pathname).equal('/Observations')
  })

  it('Resources | ESW-441', () => {
    renderWithRouter(
      <App>
        <Routes />
      </App>
    )

    const resources = screen.getAllByRole('Resources')
    expect(resources).to.have.length(2)

    userEvent.click(resources[0], leftClick)
    expect(window.location.pathname).equal('/Resources')
  })
})
