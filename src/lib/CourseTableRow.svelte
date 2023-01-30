<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { getCourseSections, type Course, type CourseSection } from './course-outlines-api';
	import CourseTableSectionRow from './CourseTableSectionRow.svelte';

	export let year: string;
	export let term: string;
	export let department: string;
	export let course: Course;

	let courseSections: CourseSection[] = [];
	let isLoading = false;
	onMount(() => {
		isLoading = true;
		getCourseSections({
			year,
			term,
			department,
			courseNumber: course.value
		})
			.then((data) => (courseSections = data))
			.catch(console.error)
			.finally(() => (isLoading = false));
	});

	function getRandomBorder() {
		const variants = ['', 'border-2', 'border-3', 'border-4', 'border-5', 'border-6'];
		return 'border ' + variants[Math.floor(Math.random() * variants.length)];
	}

	$: [firstCourseSection, ...remainingCourseSections] = courseSections;
</script>

<tr in:fly={{ y: 200 }}>
	<th rowspan={Math.max(courseSections.length, 1)} class={getRandomBorder()}>{course.text}</th>
	<td rowspan={Math.max(courseSections.length, 1)}>{course.title}</td>
	{#if isLoading}
		<td colspan="7">
			<p>Loading course sections...</p>
		</td>
	{:else if courseSections.length > 0}
		<CourseTableSectionRow {year} {term} {department} {course} courseSection={firstCourseSection} />
	{/if}
</tr>
{#each remainingCourseSections as courseSection, i}
	<tr in:fly={{ y: 200 }}>
		<CourseTableSectionRow {year} {term} {department} {course} {courseSection} />
	</tr>
{/each}
