/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import get from 'lodash.get';
import FuzzySearch from '@reeganexe/react-fuzzy';

import Match from './Match';
import loadServices from './rancher';

import style from './style.css'; // eslint-disable-line no-unused-vars

const ID_REGEX = /env\/([a-z0-9]+)/;

const stopPropagation = e => e.stopPropagation();

const Ports = ({ publicEndpoints }) => {
  if (!publicEndpoints) {
    return null;
  }

  return publicEndpoints
    .map((p, i) => (
      <a
        key={`${p.port}-${i}`}
        href={`http://${p.ipAddress}:${p.port}`}
        onClick={stopPropagation}
        target="_blank"
        rel="noopener noreferrer"
        title="Open in new tab"
      >
        {p.port}
      </a>
    ));
};

const renderItem = (props, state, styles, clickHandler) => (
  state.results.map(({ item: val, matches }, i) => {
    const style = state.selectedIndex === i ? { ...styles.selectedResultStyle, backgroundColor: '#e4e4e4' } : styles.resultsStyle;
    const cls = state.selectedIndex === i ? 'style.selected' : '';

    return (
      <div
        key={val.model.id}
        styleName={cls}
        style={style}
        onClick={() => clickHandler(i)}
      >
        <Match matches={matches} field="name" fallback={val} styleName="style.highlight" />
        <span styleName="style.ports"><Ports publicEndpoints={val.model.publicEndpoints} /></span>
        { val.ipAddress && <span style={{ float: 'right', opacity: 0.5 }}>ip {val.ipAddress}</span> }
      </div>
    );
  })
);

export default class Search extends React.Component {
  state = { containers: null, show: false }

  componentDidMount() {
    this.fetch();

    document.addEventListener('keydown', this.onDocumentKeyDown);
    document.addEventListener('reload-di', this.fetch);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown);
    document.removeEventListener('reload-di', this.fetch);
    this.interval && clearTimeout(this.interval);
  }

  onDocumentKeyDown = e => {
    if (e.keyCode === 32 && e.ctrlKey) {
      this.setState({ show: !this.state.show });
    } else if (e.keyCode === 27) {
      this.setState({ show: false });
    }
  }

  onItemSelected = ({ item }) => {
    window.postMessage(item, '*'); // document.dispatchEvent(new CustomEvent('golang', { detail: item }));
    this.setState({ show: false });
  }

  checkServicesAvailability = () => {
    const { containers } = this.state;

    // Retry to get the new services
    if (!containers || containers.length === 0) {
      this.interval = setTimeout(this.fetch, 2000);
    }
  }

  fetch = () => {
    if (!ID_REGEX.test(window.location.href)) {
      this.interval = setTimeout(this.fetch, 2000); // retry after 2 seconds
      return;
    }

    const projectId = window.location.href.match(ID_REGEX)[1];

    loadServices(projectId)
      .then(collections => this.setState({ containers: collections.data.map(composeSearchItem) }))
      .catch(this.checkServicesAvailability);
  }

  render() {
    if (!this.state.containers) {
      return null;
    }

    if (!this.state.show) {
      return null;
    }

    return (
      <FuzzySearch
        styleName="style.search-box"
        list={this.state.containers}
        autoFocus
        keys={['name', 'ipAddress', 'ports']}
        onSelect={this.onItemSelected}
        placeholder="Search for name or port"
        options={{ includeMatches: true, distance: 50, maxPatternLength: 20 }}
        resultsTemplate={renderItem}
        threshold={0.4}
      />);
  }
}

function composeSearchItem(model) {
  const ipAddress = get(model, 'publicEndpoints[0].ipAddress');
  const endPoints = model.publicEndpoints || [];
  return {
    name: model.name,
    ipAddress,
    ports: endPoints.map(p => p.port).join(' '),
    model
  };
}
