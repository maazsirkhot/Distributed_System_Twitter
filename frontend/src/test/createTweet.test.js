import { mount } from 'enzyme'
import 'jest-localstorage-mock'

import React from 'react'
import { render } from 'enzyme'
import { shallow } from 'enzyme'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MyComponent from '../components/user/home'
import { MemoryRouter as Router, withRouter } from 'react-router-dom'

configure({ adapter: new Adapter() })
describe('MyComponent', () => {
  it('Create a New Tweet', () => {
    const wrapper = shallow(<MyComponent />)
    console.log(wrapper)

    expect(wrapper.find('#tweetContent').length).toBe(1)
    const tweet = wrapper.find('#tweetContent')
    tweet.value = 'New Tweet'
    expect(tweet.value).toBe('New Tweet')
    wrapper
      .find('#Tweet')
      .simulate('click', { preventDefault: () => undefined })
    const tweet1 = wrapper.find('#tweetContent').text()

    expect(tweet1).toBe('')
  })
})
