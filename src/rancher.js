export default projectId => fetch(`${process.env.RANCHER_ADDR}/v2-beta/projects/${projectId}/services?limit=-1&sort=name`, {
  credentials: 'include',
  headers: {
    accept: 'application/json',
    'x-api-no-challenge': true
  }
}).then(r => r.json());
