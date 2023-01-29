<script lang="ts">
	import { getRandomBorder } from './style-helpers';
	import DayTimeDurationDisplay from './DayTimeDurationDisplay.svelte';
	import {
		getCourseOutline,
		type Course,
		type CourseOutline,
		type CourseSection,
		type WeekDayAbbreviations
	} from './course-outlines-api';

	export let year: string;
	export let term: string;
	export let department: string;
	export let course: Course;
	export let courseSection: CourseSection;

	let courseOutline: CourseOutline;
	let courseOutlineController: AbortController;
	$: {
		courseOutlineController?.abort();
		courseOutlineController = new AbortController();
		getCourseOutline({
			year,
			term,
			department,
			courseNumber: course.value,
			courseSection: courseSection.value
		})
			.then((data) => (courseOutline = data))
			.catch(console.error);
	}

	let dayTimes: Record<WeekDayAbbreviations, { startTime: string; endTime: string } | null> = {
		Mo: null,
		Tu: null,
		We: null,
		Th: null,
		Fr: null,
		Sa: null,
		Su: null
	};

	$: if (courseOutline?.courseSchedule) {
		for (let schedule of courseOutline.courseSchedule) {
			for (let day of schedule.days.split(', ')) {
				dayTimes[day as WeekDayAbbreviations] = {
					startTime: schedule.startTime,
					endTime: schedule.endTime
				};
			}
		}
	}
</script>

<th class={getRandomBorder()}>{courseSection.text}</th>
<td>{courseSection.sectionCode}</td>
<td>
	{#if dayTimes.Mo}
		<DayTimeDurationDisplay {...dayTimes.Mo} />
	{/if}
</td>
<td>
	{#if dayTimes.Tu}
		<DayTimeDurationDisplay {...dayTimes.Tu} />
	{/if}
</td>

<td>
	{#if dayTimes.We}
		<DayTimeDurationDisplay {...dayTimes.We} />
	{/if}
</td>

<td>
	{#if dayTimes.Th}
		<DayTimeDurationDisplay {...dayTimes.Th} />
	{/if}
</td>

<td>
	{#if dayTimes.Fr}
		<DayTimeDurationDisplay {...dayTimes.Fr} />
	{/if}
</td>
