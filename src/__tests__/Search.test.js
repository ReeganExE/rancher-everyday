import React from 'react';
import { shallow } from 'enzyme';

import Search from '../Search';

jest.mock('../rancher', () => () => Promise.resolve({
  data: [
    {
      name: 'test-service',
      id: 'test-service',
      project: {
        key: 'test-service'
      }
    }
  ]
}));
const map = {};

document.addEventListener = jest.fn((event, cb) => {
  map[event] = cb;
});

describe('<Search />', () => {
  const wrapper = shallow(<Search />);

  it('renders Search box when triggering Ctrl + Space', async () => {
    // Simulate Ctrl + Space
    map.keydown({ keyCode: 32, ctrlKey: true });
    await wrapper.update();

    const cmp = wrapper.find('FuzzySearch');
    expect(cmp).toHaveLength(1);
    expect(cmp.prop('list')).toHaveLength(1);
  });

  it('should have an input element', () => {
    const rendered = wrapper.render();
    expect(rendered.find('input')).toHaveLength(1);
  });
});
