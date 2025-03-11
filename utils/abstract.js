import http from 'k6/http';
import { check } from 'k6';

// Utility function to handle API requests
function handleRequest(method, metadata, body = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (metadata.token) {
        headers['Authorization'] = `Bearer ${metadata.token}`;
    }

    const params = {
        headers: headers,
        tags: {
            name: metadata.tag,
            job: metadata.job,
        },
    };

    const response = body ? http[method](metadata.url, JSON.stringify(body), params) : http[method](metadata.url, params);

    // Validate response status
    const success = check(response, {
        [`${metadata.job} - status ${metadata.status || 200}`]: (r) => r.status === (metadata.status || 200),
    });

    if (!success) {
        return { success: false, status: response.status, error: response.body };
    }

    try {
        return { success: true, data: response.json() };
    } catch (error) {  // Explicitly catch the error
        return { success: false, status: response.status, error: "Invalid JSON response" };
    }
}

// GET request with payload (includes query parameters or authentication)
export function get_abstract_with_payload(metadata) {
    return handleRequest('get', metadata);
}

// GET request without payload (simple GET request)
export function get_abstract_without_payload(metadata) {
    return handleRequest('get', metadata);
}

// POST request with payload
export function post_abstract_with_payload(metadata) {
    return handleRequest('post', metadata, metadata.payload);
}

// PATCH request with payload
export function patch_abstract_with_payload(metadata) {
    return handleRequest('patch', metadata, metadata.payload);
}

// DELETE request without payload
export function delete_abstract_without_payload(metadata) {
    return handleRequest('del', metadata);
}

export function put_abstract_with_payload(metadata) {
    return handleRequest('put', metadata);
}
