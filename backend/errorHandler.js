// https://docs.pdfgeneratorapi.com/v4/#section/Error-codes
const handleApiError = (statusCode, message, res) => {
    let error;
    switch (statusCode) {
        case 400:
            error = message || 'Bad Request';
            break;
        case 401:
            error = message || 'Unauthorized: Authentication failed.';
            break;
        case 402:
            error = message || 'Payment Required: Your account is suspended, please upgrade your account.';
            break;
        case 403:
            error = message || 'Forbidden';
            break;
        case 404:
            error = message || 'Not Found';
            break;
        case 422:
            error = message || 'Unprocessable Entity';
            break;
        case 429:
            error = message || 'Too Many Requests: You can make up to 2 requests per second and 60 requests per minute.';
            break;
        default:
            error = message || 'An unknown error has occurred.';
            break;
    }

    return res.status(statusCode).json({ error: error });
};

const handleCatchError = (err, res) => {
    console.error('Error:', err);
    res.status(500).json({ error: `Request Failed: ${err}` });
};

module.exports = { handleApiError, handleCatchError };