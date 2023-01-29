<script lang="ts">
	import { getCourses, type Course } from './course-outlines-api';
	import CourseTableRow from './CourseTableRow.svelte';

	export let year: string;
	export let term: string;
	export let department: string;

	let courses: Course[] = [];

	let loaded: boolean = false;

	let coursesController: AbortController;

	$: {
		coursesController?.abort();
		coursesController = new AbortController();
		getCourses({ year, term, department }, coursesController.signal)
			.then((data) => {
				courses = data;
				loaded = true;
			})
			.catch(console.error);
	}
</script>

<table align="left" class="table-hover">
	<thead>
		<tr>
			<th rowspan="3">Course #</th>
			<th rowspan="3">Title</th>
			<th colspan="3" scope="colgroup">Sections</th>
		</tr>
		<tr>
			<th rowspan="2" scope="col">#</th>
			<th rowspan="2" scope="col">Type</th>
			<th colspan="5" scope="colgroup">Days</th>
		</tr>
		<tr class="child-borders">
			<th scope="colgroup">Monday</th>
			<th scope="colgroup">Tuesday</th>
			<th scope="colgroup">Wednesday</th>
			<th scope="colgroup">Thursday</th>
			<th scope="colgroup">Friday</th>
		</tr>
		<tr>
			<th scope="col">7:00AM</th>
		</tr>
	</thead>
	<tbody>
		{#if year && term && department}
			{#each courses as course (course.value)}
				<CourseTableRow {year} {term} {department} {course} />
			{/each}
		{:else}
			<h3>Please provide the above fields.</h3>
		{/if}
	</tbody>
</table>

<style lang="scss">
</style>
