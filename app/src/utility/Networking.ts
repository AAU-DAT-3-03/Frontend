import * as console from "console";

enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

type Header = {
    key: string;
    value: string;
}

type NetworkOptions = {
    body?: string;
    headers?: Headers;
}

type NetworkCallback = (value: Response) => void;

class Networking {
    private body?: string;
    private headers: Headers = new Headers();

    /**
     * Appends header(s) to the current request
     * @param {string} key - Header name
     * @param {string | string[]} value - Header value
     */
    public setHeader(key: string, value: string | string[]): Networking {
        if (typeof value === "string") {
            this.headers.append(key, value);
        } else {
            value.forEach((v: string) => this.headers.append(key, v));
        }
        return this;
    }

    /**
     * Creates GET request to a specified resource
     * @param {string} url - Url corresponding to the resource
     * @param {NetworkOptions} options - Fetch options for request
     * @param {NetworkCallback} callback - Callback to call after successful request
     */
    public get(url: string, options?: NetworkOptions, callback?: NetworkCallback): void {
        this.fetch(url, Method.GET, options, callback);
    }

    /**
     * Creates POST request to a specified resource
     * @param {string} url - Url corresponding to the resource
     * @param {NetworkOptions} options - Fetch options for request
     * @param {NetworkCallback} callback - Callback to call after successful request
     */
    public post(url: string, options: NetworkOptions, callback?: NetworkCallback): void {
        this.fetch(url, Method.POST, options, callback);
    }

    /**
     * Creates PUT request to a specified resource
     * @param {string} url - Url corresponding to the resource
     * @param {NetworkOptions} options - Fetch options for request
     * @param {NetworkCallback} callback - Callback to call after successful request
     */
    public put(url: string, options: NetworkOptions, callback?: NetworkCallback): void {
        this.fetch(url, Method.PUT, options, callback);
    }

    /**
     * Creates DELETE request to a specified resource
     * @param {string} url - Url corresponding to the resource
     * @param {NetworkOptions} options - Fetch options for request
     * @param {NetworkCallback} callback - Callback to call after successful request
     */
    public delete(url: string, options?: NetworkOptions, callback?: NetworkCallback): void {
        this.fetch(url, Method.DELETE, options, callback);
    }

    /**
     * Appends NetworkOptions to the current fetch builder
     * @param {NetworkOptions} options - Options for fetch
     * @private
     */
    private appendNetworkOptions(options: NetworkOptions): void {
        if (options.body !== undefined) this.body = options.body;

        if (options.headers !== undefined) {
            for (let headersKey in options.headers) {
                this.headers.append(headersKey, <string> options.headers.get(headersKey));
            }
        }
    }

    /**
     * Sends request to the specified url and calls the callback on success
     * @param {string} url - Url corresponding to the resource
     * @param {Method} method - Http method of the request
     * @param {NetworkOptions} options - Fetch options for request
     * @param {NetworkCallback} callback - Callback to call after successful request
     * @private
     */
    private fetch(url: string, method: Method, options?: NetworkOptions, callback?: NetworkCallback): void {
        if (options !== undefined) this.appendNetworkOptions(options);

        fetch(url, {
            method:  method,
            headers: this.headers,
            body:    this.body
        }).then((value: Response) => {
            if (callback !== undefined) callback(value);
        }).catch(reason => console.error(reason));
    }
}

export default Networking;