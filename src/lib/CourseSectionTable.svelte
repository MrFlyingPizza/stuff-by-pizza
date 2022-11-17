<script lang="ts">
	import { getSections, type Section } from './CourseOutlinesApiWrapper';
	import CourseSectionRow from './CourseSectionRow.svelte';

	export let year: string;
	export let term: string;
	export let department: string;
	export let courseNumber: string;

	let courseSections: Section[] = [];

	let sectionAbortController: AbortController;

	$: {
		sectionAbortController?.abort();
		sectionAbortController = new AbortController();
		getSections(year, term, department, courseNumber, sectionAbortController).then(
			(response) => (courseSections = response.data)
		).catch(error => error);
	}
</script>

<table>
	{#each courseSections as courseSection}
		<CourseSectionRow
			{year}
			{term}
			{department}
			{courseNumber}
			courseSection={courseSection.value}
		/>
	{/each}
</table>
