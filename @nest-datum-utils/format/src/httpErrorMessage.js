
const httpErrorMessage = (err, title = 'Unhandled error') =>  `${title}: \n${(err || {}).response
	? ((err.response || {}).data
		? (err.response.data || {}).message || ((err.response.data || {}).error
			? (err.response.data.error || {}).text || ''
			: (err || {}).message || '')
		: (err || {}).message || '')
	: (err || {}).message || ''}`;

export default httpErrorMessage;
