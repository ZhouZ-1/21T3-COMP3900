/**
 * API helper file for connecting the frontend to the backend.
 * 
 */
const url = 'http://localhost:27439'
const headers = {"Content-Type": "application/json"}

/**
 * A simple function for the api that takes in the path, method and body, and returns a json promise.
 * @param {String} path The resource in the backend that you want to access.
 * @param {String} method The HTTP method you want to use to access the resource. 
 * @param {Object} body A object that represents the body of the request. It will be converted and sent as JSON.
 * @precondition method is a valid HTTP method such as GET, POST, PUT, DELETE.
 */
export default async function api(path, method, body = null) {
  let init = {method, headers}
  let resource = `${url}/${path}`

  // Check if body exists
  if (body) init.body = JSON.stringify(body)

  return fetch(resource, init)
    .then((res) => res.json())
    .catch((err) => console.warn(`API_ERROR: ${err.message}`));
}
