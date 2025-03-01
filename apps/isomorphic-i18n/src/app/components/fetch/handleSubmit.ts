import { fetchData } from './fetch';

export default function handleSubmit({
	link,
	data,
	setLoading,
	setSubmittedSuccessfully,
	setErrorMsg,
	lang, 
	setData,
	method = 'POST',
	...props
}:Parameters<typeof fetchData>[0] & {
	setLoading: (loading: boolean)=>void,
	setSubmittedSuccessfully: (submitted: boolean, res?: any)=>void,
	setData?: (data: any)=>void
	setErrorMsg: (err: any)=>void,
}) {
	setLoading(true);	
	fetchData({
		link: link,
		method: method,
		data: data,
		lang: lang,
		// ...props
	}).then((res)=>{
			console.log(res);
		if (res?.success) {
			setSubmittedSuccessfully(true);
			setData?.(res.data)
		} else {
			setErrorMsg(res);
		}
		setLoading(false);
	});
}