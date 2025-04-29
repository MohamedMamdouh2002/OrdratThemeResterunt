'use server';
import { API_BASE_URL } from '../../config/base-url';
type Fetchtype = {
	link: string,
	section?: string,
	lang: string,
	revalidate?: number,
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	headers?: Record<string, any>,
	multipart?: boolean,
	isPaginated?: boolean,
	data?: any
}
export async function fetchData<T>({
	link,
	section = link,
	lang = 'en',
	revalidate = 0,
	method = 'GET',
	headers = {},
	multipart = false,
	isPaginated = false,
	data
}:Fetchtype) {
	headers = {
		...headers,
		"Accept-language": lang
	};

	let options: Record<string, any> = {
		method: method,
		headers: headers,
		next: {
			tags: [section],
			revalidate: revalidate // comment it on live coz revalidateTag not working
		}
	};
	if (!multipart && !(data instanceof FormData)) {
		headers['content-type'] = 'application/json';
	}

	if (multipart && data instanceof FormData) {
		options['body'] = data;
	} else {
		if (method == 'POST' || method == 'DELETE' || method == 'PATCH')
			options['body'] = JSON.stringify(data);
	}

	let responseData: T | undefined;
	let responseClone;
	let status = 0;
	let success = false;
	let message = '';
	try {
		const res = await fetch(
			`${API_BASE_URL}/${link}`,
			options
		);
		responseClone = res.clone();
		status = res.status;
		const dataReceived = await res.json() as T;
		// if (dataReceived?.success) success = dataReceived.success;
		success = true
		// if (dataReceived?.data) responseData = dataReceived.data;
		responseData = dataReceived
		// if (dataReceived?.message) message = dataReceived.message;
		message = "API has been fetched successfully"
	} catch (error) {
		console.log(error);
		status = responseClone?.status || 0;
		message = (await responseClone?.text()) || error as string || 'Error, please try again later';
	}

	return {
		success: success,
		message: message,
		data: responseData,
		status: status
	};
}
