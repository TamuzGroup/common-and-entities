import axios, {
  AxiosBasicCredentials,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import fetch from "node-fetch";

const defaultHeaders = (authToken: AxiosBasicCredentials | string) => ({
  Authorization: `Bearer ${authToken}`,
  "Content-Type": "application/json; charset=utf-8",
});
const defaultFetchOptions = (options: AxiosRequestConfig & string) => ({
  method: options.method || "GET",
  mode: "cors",
  cache: "no-cache",
  body: {},
  headers: {},
});

export function axiosRequest(
  path: string,
  options: AxiosRequestConfig & any
): Promise<AxiosResponse> {
  const authToken = options.auth ? options.auth : null;
  const headers = defaultHeaders(authToken);
  const fetchOptions = defaultFetchOptions(options);
  if (options.data) fetchOptions.body = options.data;

  if (options.headers) {
    options.headers.forEach(([key, val]: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      headers[key] = val;
      if (val === null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete headers[key];
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fetchOptions.headers = new fetch.Headers(headers);

  return axios
    .request<never, AxiosResponse>({
      method: fetchOptions.method,
      url: path,
      headers,
      data: fetchOptions.body,
    })
    .then((response) => {
      if (response.status === 200) return response.data;
    });
}
