/* eslint-disable no-underscore-dangle */
import debounce from 'lodash.debounce';

window.addEventListener('message', e => {
  if (e.source === window && e.data.model) {
    transitionTo(e.data.model);
  }
});

function transitionTo(model) {
  const r = getApplications()[0].__container__.lookup('router:main');
  r.transitionTo('stack.index', model.stackId);
  r.transitionTo('service.containers', model.id);
}

function getApplications() {
  const namespaces = Ember.A(Ember.Namespace.NAMESPACES);

  return namespaces.filter(namespace => namespace instanceof Ember.Application);
}

const reload = debounce(() => document.dispatchEvent(new CustomEvent('reload-di')), 1000, { leading: true, trailing: false });

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      const { display, opacity } = mutation.target.style;
      if (opacity === '' && display === 'none') {
        observer.disconnect();
        reload();
      }
    }
  });
});

Ember.$(() => {
  Ember.$(document.body).on('click', '.project-menu a.clip', () => {
    observer.observe(document.getElementById('loading-underlay'), {
      attributes: true,
      attributeOldValue: true
    });
  });
});
