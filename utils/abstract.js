import http from 'k6/http';
import { check } from 'k6';

// GET request with payload (includes query parameters or authentication)
export function get_abstract_with_payload(metadata) {
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

    const response = http.get(metadata.url, params);

    if (!metadata.fail) {
        check(response, {
            [`${metadata.job} - status is ${metadata.status || 200}`]: (r) => r.status === (metadata.status || 200),
        }) || (metadata.fail === false && console.log(`Warning: ${metadata.job} failed with status ${response.status}`));
    }

    return response.json();
}

// GET request without payload (simple GET request)
export function get_abstract_without_payload(metadata) {
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

    const response = http.get(metadata.url, params);

    if (!metadata.fail) {
        check(response, {
            [`${metadata.job} - status is ${metadata.status || 200}`]: (r) => r.status === (metadata.status || 200),
        }) || (metadata.fail === false && console.log(`Warning: ${metadata.job} failed with status ${response.status}`));
    }

    return response;
}

// POST request with payload
export function post_abstract_with_payload(metadata) {
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

    const response = http.post(metadata.url, JSON.stringify(metadata.payload), params);

    // Check if the request was successful
    const success = check(response, {
        [`${metadata.job} - status is ${metadata.status || 201}`]: (r) => r.status === (metadata.status || 201),
    });

    if (!success) {
        console.error(`❌ ${metadata.job} failed! Status: ${response.status}, Response: ${response.body}`);
        return null;
    }

    return response.json();
}
// PATCH request with payload
export function patch_abstract_with_payload(metadata) {
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

    const response = http.patch(metadata.url, JSON.stringify(metadata.payload), params);

    if (!metadata.fail) {
        check(response, {
            [`${metadata.job} - status is ${metadata.status || 200}`]: (r) => r.status === (metadata.status || 200),
        }) || (metadata.fail === false && console.log(`Warning: ${metadata.job} failed with status ${response.status}`));
    }

    return response.json();
}

// DELETE request without payload
export function delete_abstract_without_payload(metadata) {
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

    const response = http.del(metadata.url, null, params);

    if (!metadata.fail) {
        check(response, {
            [`${metadata.job} - status is ${metadata.status || 200}`]: (r) => r.status === (metadata.status || 200),
        }) || (metadata.fail === false && console.log(`Warning: ${metadata.job} failed with status ${response.status}`));
    }

    return response;
}