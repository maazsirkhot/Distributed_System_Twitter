import { mount } from 'enzyme'
import 'jest-localstorage-mock'

import React from 'react'
import { render } from 'enzyme'
import { shallow } from 'enzyme'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MyComponent from '../components/analytics/analytics'
import { MemoryRouter as Router, withRouter } from 'react-router-dom'

configure({ adapter: new Adapter() })
describe('MyComponent', () => {
  it('Render Analytical Data', () => {
    const wrapper = shallow(<MyComponent />)
    console.log(wrapper)
    expect(wrapper.find('TopViewed').exists()).toBeTruthy()
    expect(wrapper.find('TopLiked').exists()).toBeTruthy()

    expect(wrapper.find('Navbar').exists()).toBeTruthy()
    // expect(wrapper.find('ProfileViews').exists()).toBeTruthy()
  })
})
