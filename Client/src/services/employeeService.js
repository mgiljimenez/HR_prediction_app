import http from './httpService'

import config from '../config.json'

const endpoint = config.apiURL + '/employees/'

function getEndpoint(id) {
	return !id ? endpoint : endpoint + '/' + id
}

function getAllEmployees() {
	return http.get(getEndpoint())
}

const employeeService = {
	getAllEmployees,

}

export default employeeService
