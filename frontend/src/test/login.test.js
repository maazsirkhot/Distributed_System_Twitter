import { mount } from 'enzyme'
import 'jest-localstorage-mock'

import React from 'react'
import { shallow } from 'enzyme'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MyComponent from '../components/root/login'
import { MemoryRouter as Router, withRouter } from 'react-router-dom'

configure({ adapter: new Adapter() })
describe('MyComponent', () => {
  it('Incorrect Login', () => {
    const props = {
      component: () => {}
    }
    const wrapper = shallow(<MyComponent />)
    console.log('testing Invalid Login - Success')
    // const Btn = wrapper.find('button.userLogin')
    // Btn.simulate('click')
    // const text = wrapper.find('p').text()
    // expect(text).toEqual('Fiels cannot be empty')
    expect(
      wrapper
        .find('input')
        .at(2)
        .prop('value')
    ).toEqual('Login')
    expect(wrapper.find('input')).toHaveLength(3)
    expect(
      wrapper
        .find('#userLogin')
        .simulate('click', { preventDefault: () => undefined })
    )
    const text = wrapper
      .find('p')
      .at(0)
      .text()
    expect(text).toEqual(' Fields cannot be empty ')
  })
})
