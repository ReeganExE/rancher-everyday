/* eslint-disable object-curly-newline */

import React from 'react';
import Highlighter from 'react-highlight-words';
import find from 'lodash.find';

export default ({ matches, field: key, fallback, className }) => {
  const matched = find(matches, { key });
  if (matched) {
    const { indices, value } = matched;

    const words = indices.map(([start, end]) => value.substring(start, end + 1));
    return (
      <Highlighter
        highlightClassName={className}
        searchWords={words}
        highlightTag="span"
        autoEscape
        textToHighlight={fallback[key]}
      />);
  }

  return <span>{fallback[key]}</span>;
};
