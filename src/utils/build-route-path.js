export function buildRouteRegex(path) {
    // Transforma definições de rotas em expressões regulares
    // exemplo: /tasks/:id -> /tasks/(<?id>[a-zA-Z0-9\-]+)
    // extract all the parameters from the path
    const ROUTE_PARAMS_REGEX = /:\w+/g;

    const params = path.match(ROUTE_PARAMS_REGEX);

    if (!params) {
        return new RegExp(`^${path}$`, 'g');
    }

    params.forEach(param => {
        const paramName = param.replace(':', '');
        const regex = `(?<${paramName}>[a-zA-Z0-9\-]+)`;
        path = path.replace(param, regex);
    });

    return new RegExp(`^${path}$`, 'g');
}