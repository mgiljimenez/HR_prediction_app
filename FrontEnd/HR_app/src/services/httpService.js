import axios from 'axios'

import config from '../config.json'

axios.interceptors.response.use(false, function (error) {
	if (error.response.status >= 500) {
		console.log('Algo ha ocurrido volvemos pronto.')
	} else if (error.response.status >= 400) {
	console.log(error.response.data)
	}
	return Promise.reject(error)
	
})

function setToken(jwt) {
	if (!jwt) return

	axios.defaults.headers.common['x-auth-token'] = jwt
}

const http = {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
	setToken,
}

export default http
