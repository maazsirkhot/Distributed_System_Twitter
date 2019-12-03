import { mount } from 'enzyme'
import 'jest-localstorage-mock'
import { spy } from 'sinon'

import React from 'react'
import { shallow } from 'enzyme'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MyComponent from '../components/root/createAccount'

configure({ adapter: new Adapter() })
describe('MyComponent', () => {
  it('Check the Create Account snapshot after sending props', () => {
    console.log('Matching snapshots with create account- Success')
    const props = {
      component: () => {}
    }
    const component = shallow(<MyComponent {...props} debug />)

    expect(component).toMatchSnapshot()
  })
})
