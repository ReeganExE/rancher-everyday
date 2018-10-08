import React from 'react';
import { shallow } from 'enzyme';

import Match from '../Match';

describe('<Match />', () => {
  const matches = [{
    indices: [[2, 2], [6, 7]],
    value: 'Brainiac-service',
    key: 'name'
  }];

  const obj = { name: 'Brainiac-service', id: 'Brainiac-service', project: { key: 'MANAGEMENT' } };
  const wrapper = shallow(<Match matches={matches} field="name" fallback={obj} />);

  it('should have words highlighted', () => {
    expect(wrapper.find('Highlighter').prop('searchWords')).toEqual(['a', 'ac']);
  });

  it('should have full text rendered', () => {
    expect(wrapper.find('Highlighter').prop('textToHighlight')).toBe('Brainiac-service');
  });
});
