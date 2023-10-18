import * as console from 'console';

enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

type RequestHeaders = { key: string; value: string | string[] }[];

type NetworkOptions = {
	body?: null | string | object;
	headers?: RequestHeaders;
};

type NetworkCallback = (value: object) => void;

type FetchSettings = {
	method: string;
	headers?: Headers;
	body?: string | null;
};

class Networking {
	private headers: Headers = new Headers();

	/**
	 * Appends header(s) to the current request
	 * @param {string} key - Header name
	 * @param {string | string[]} value - Header value
	 */
	public setHeader(key: string, value: string | string[]): Networking {
		if (typeof value === 'string') {
			this.headers.append(key, value);
		} else {
			value.forEach((v: string) => this.headers.append(key, v));
		}
		return this;
	}

	/**
	 * Creates GET request to a specified resource
	 * @param {string} url - Url corresponding to the resource
	 * @param {RequestHeaders} headers - Request headers
	 * @param {NetworkCallback} callback - Callback to call after successful request
	 */
	public get(url: string, headers?: RequestHeaders, callback?: NetworkCallback): void {
		this.fetch(url, Method.GET, { headers: headers }).then(callback);
	}

	/**
	 * Creates POST request to a specified resource
	 * @param {string} url - Url corresponding to the resource
	 * @param {NetworkOptions} options - Fetch options for request
	 * @param {NetworkCallback} callback - Callback to call after successful request
	 */
	public post(url: string, options: NetworkOptions, callback?: NetworkCallback): void {
		this.fetch(url, Method.POST, options).then(callback);
	}

	/**
	 * Creates PUT request to a specified resource
	 * @param {string} url - Url corresponding to the resource
	 * @param {NetworkOptions} options - Fetch options for request
	 * @param {NetworkCallback} callback - Callback to call after successful request
	 */
	public put(url: string, options: NetworkOptions, callback?: NetworkCallback): void {
		this.fetch(url, Method.PUT, options).then(callback);
	}

	/**
	 * Creates DELETE request to a specified resource
	 * @param {string} url - Url corresponding to the resource
	 * @param {NetworkOptions} options - Fetch options for request
	 * @param {NetworkCallback} callback - Callback to call after successful request
	 */
	public delete(url: string, options?: NetworkOptions, callback?: NetworkCallback): void {
		this.fetch(url, Method.DELETE, options).then(callback);
	}

	/**
	 * Creates the settings for creating a fetch request
	 * @param {Method} method - The Http method to use
	 * @param {NetworkOptions} options - Optional NetworkOptions
	 * @private
	 */
	private createFetchSettings(method: Method, options?: NetworkOptions): FetchSettings {
		let settings: FetchSettings = {
			method: method,
			body: options?.body ? JSON.stringify(options.body) : null
		};

		if (options?.headers) {
			// Add all headers from options to the pre-existing list
			options.headers.forEach((value) => this.setHeader(value.key, value.value));
			settings.headers = this.headers;
		}

		return settings;
	}

	/**
	 * Sends request to the specified url and calls the callback on success
	 * @param {string} url - Url corresponding to the resource
	 * @param {Method} method - Http method of the request
	 * @param {NetworkOptions} options - Fetch options for request
	 * @private
	 */
	private async fetch(url: string, method: Method, options?: NetworkOptions): Promise<Object> {
		let settings = this.createFetchSettings(method, options);

		return fetch(url, settings)
			.then((value: Response) => {
				// First get the response body as a string
				return value.text();
			})
			.then((value: string) => {
				// Try to convert the body as string to a JSON object
				return JSON.parse(value);
			})
			.catch((reason) => console.error(reason));
	}
}

export default Networking;
