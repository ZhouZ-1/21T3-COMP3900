/**
 * API helper file for connecting the frontend to the backend.
 * 
 */
const url = 'http://localhost:5000'
const headers = {"Content-Type": "application/json"}

/**
 * 
 */
export default function api(path, method, body = null) {
  let init = {method, headers}
  let resource = `${url}/${path}`

  // Check if body exists
  if (body) init.body = JSON.stringify(body)


  return fetch(resource, init)
    .then((res) => res.json())
    .catch((err) => console.warn(`API_ERROR: ${err.message}`));
}



//export default api;
