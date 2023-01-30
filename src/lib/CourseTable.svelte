<script lang="ts">
	import { getCourses, type Course } from './course-outlines-api';
	import CourseTableRow from './CourseTableRow.svelte';

	export let year: string;
	export let term: string;
	export let department: string;
	export let weekDayBarWidth = 500;

	let coursesController: AbortController;
	let coursesRequest: Promise<Course[]>;
	$: {
		coursesController?.abort();
		coursesController = new AbortController();
		coursesRequest = getCourses({ year, term, department }, coursesController.signal);
	}
</script>

<table class="table-hover">
	<colgroup>
		<col />
		<col />
		<col />
		<col />
		<col span="5" class="weekday-columns" style={`width: ${weekDayBarWidth}px`} />
	</colgroup>
	<thead>
		<tr>
			<th rowspan="2" style="width: 4em;">Course Number</th>
			<th rowspan="2" style="width: 10em;">Title</th>
			<th rowspan="2" scope="col" style="width: 4em;">Section Number</th>
			<th rowspan="2" scope="col" style="width: 4em;">Type</th>
			<th colspan="5" scope="colgroup">Schedule</th>
		</tr>
		<tr class="child-borders">
			<th scope="colgroup">Monday</th>
			<th scope="colgroup">Tuesday</th>
			<th scope="colgroup">Wednesday</th>
			<th scope="colgroup">Thursday</th>
			<th scope="colgroup">Friday</th>
		</tr>
	</thead>
	<tbody>
		{#await coursesRequest}
			<tr>
				<td colspan="9">
					<p>Loading courses...</p>
				</td>
			</tr>
		{:then courses}
			{#key courses}
				{#each courses as course}
					<CourseTableRow {year} {term} {department} {course} />
				{/each}
			{/key}
		{:catch}
			<tr>
				<td colspan="9">Failed to load courses. Maybe check your selections?</td>
			</tr>
		{/await}
	</tbody>
</table>

<style lang="scss">
	table {
		table-layout: fixed;
	}

	.weekday-columns {
		transition: width 0.2s ease-out;
	}
</style>
