import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useEffect } from 'react'
import { useAuth } from '../context/auth';

function Logout() {
	const [user, dispatch] = useAuth();
	const navigate = useNavigate()

	useEffect(() => {
		authService.logout()
		dispatch({ type: 'LOGOUT' })
		navigate('/')
	}, [])

	return null
}

export default Logout