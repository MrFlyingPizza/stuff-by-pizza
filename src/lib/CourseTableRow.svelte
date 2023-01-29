<script lang="ts">
	import { getCourseSections, type Course, type CourseSection } from './course-outlines-api';
	import CourseTableSectionRow from './CourseTableSectionRow.svelte';

	export let year: string;
	export let term: string;
	export let department: string;
	export let course: Course;

	let courseSections: CourseSection[] = [];
	let courseSectionsController: AbortController;
	$: {
		courseSectionsController?.abort();
		courseSectionsController = new AbortController();
		getCourseSections(
			{ year, term, department, courseNumber: course.value },
			courseSectionsController.signal
		)
			.then((data) => (courseSections = data))
			.catch(console.error);
	}

	function getRandomBorder() {
		const variants = ['', 'border-2', 'border-3', 'border-4', 'border-5', 'border-6'];
		return 'border ' + variants[Math.floor(Math.random() * variants.length)];
	}
</script>

{#each courseSections as courseSection, i (courseSection.value)}
	<tr>
		{#if i == 0}
			<th rowspan={courseSections.length} class={getRandomBorder()}>{course.value}</th>
			<td rowspan={courseSections.length}>{course.title}</td>
		{/if}
		<CourseTableSectionRow {year} {term} {department} {course} {courseSection} />
	</tr>
{/each}
