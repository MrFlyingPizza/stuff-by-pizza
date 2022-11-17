<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
	import { getCourses, type Course } from './CourseOutlinesApiWrapper';
	import CourseSectionTable from './CourseSectionTable.svelte';

	export let year: string;
	export let term: string;
	export let department: string;

	let courses: Course[] = [];

	let loaded: boolean = false;

	let coursesAbortController: AbortController;

	$: {
		coursesAbortController?.abort();
		coursesAbortController = new AbortController();
		getCourses(year, term, department, coursesAbortController)
			.then((response) => {
				courses = response;
				loaded = true;
			})
			.catch((error) => error);
	}
</script>

<DataTable style="width: 100%;">
	<Head>
		<Row>
			<Cell>Course Number</Cell>
			<Cell>Course Title</Cell>
			<Cell>Course Sections</Cell>
		</Row>
	</Head>
	{#if year && term && department}
		<Body>
			{#each courses as course}
				<Row>
					<Cell>{course.text}</Cell>
					<Cell>{course.title}</Cell>
					<Cell>
						<CourseSectionTable {year} {term} {department} courseNumber={course.value} />
					</Cell>
				</Row>
			{/each}
		</Body>
	{:else}
		<h3>Please provide the above fields.</h3>
	{/if}
	<LinearProgress slot="progress" indeterminate bind:closed={loaded} />
</DataTable>
