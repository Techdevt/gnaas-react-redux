import request from 'axios';
import apiConfig from '../../config/defaults';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    if (!process.env.BROWSER) {
        // Prepend host and port of the API server to the path.
        return 'http://' + apiConfig.apiHost + ':' + apiConfig.apiPort + adjustedPath;
    }
    // Prepend `/api` to relative URL, to proxy to API server.
    return adjustedPath;
}

class _ApiClient {
    constructor(req) {
        methods.forEach((method) =>
            this[method] = (path, { params, data } = {}) => {
                // const request = axios[method](formatUrl(path));

                if (params) {
                    request.query(params);
                }
                
                if (!process.env.BROWSER && req.session.token) {
                    request.defaults.headers.common['Authorization'] = `Bearer ${req.session.token}`;
                } else if (process.env.BROWSER && !!window.localStorage.getItem('token')) {
                    request.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(window.localStorage.getItem('token'))}`;
                }
                return request[method](formatUrl(path), data);
            });
    }
}

const ApiClient = _ApiClient;

export default ApiClient;
