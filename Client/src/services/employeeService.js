import http from './httpService'

import config from '../config.json'

const endpoint = config.apiURL + '/employees/'

function getEndpoint(id) {
	return !id ? endpoint : endpoint + '/' + id
}

function getAllEmployees() {
	return http.get(getEndpoint())
}

function getEmployeebyID(id) {
	return http.get(getEndpoint(id))
}

const employeeService = {
	getAllEmployees,
	getEmployeebyID,

}

export default employeeService 
