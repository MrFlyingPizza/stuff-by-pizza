import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	if (browser) {
		return {
			year: localStorage.getItem('year'),
			term: localStorage.getItem('term'),
			department: localStorage.getItem('department')
		};
	}
};
