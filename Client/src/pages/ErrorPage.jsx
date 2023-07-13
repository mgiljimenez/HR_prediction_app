import { useRouteError } from 'react-router-dom'

function ErrorPage() {
	const error = useRouteError()
	console.error(error)

	return (
		<div id="error-page">
			<h1>Technical Difficulties Temporarily Affecting Our Website</h1>
			<p>We apologize for the inconvenience. Our website is temporarily unavailable due to technical issues. We are working diligently to restore full functionality as soon as possible. Thank you for your understanding..</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	)
}

export default ErrorPage