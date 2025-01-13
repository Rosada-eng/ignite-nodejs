export async function setDefaultHeaders(request, response, next) {
    response.setHeader('Content-Type', 'application/json');
    next();
}