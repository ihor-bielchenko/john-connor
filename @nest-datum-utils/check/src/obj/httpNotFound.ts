
const httpNotFound = (err) => (err || {}).response && (err.response || {}).status === 404;

export default httpNotFound;
