import http from './httpService'

import config from '../config.json'

const endpoint = config.apiURL + '/employees/'

function getEndpoint(id) {
	return !id ? endpoint : endpoint + '/' + id
}

function getAllworkers() {
	return http.get(getEndpoint())
}

function getWorkerById(id) {
	return http.get(getEndpoint(id))
}



const workersService = {
	getAllworkers,
	getWorkerById,
	
}

export default workersService
