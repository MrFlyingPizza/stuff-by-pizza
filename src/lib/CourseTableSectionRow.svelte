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
	import { onMount } from 'svelte';

	export let year: string;
	export let term: string;
	export let department: string;
	export let course: Course;
	export let courseSection: CourseSection;

	type WeekDayTimes = { [key in WeekDayAbbreviations]?: { startTime: string; endTime: string } };

	function createWeekDayTimes(courseOutline: CourseOutline) {
		if (!courseOutline.courseSchedule) {
			return null;
		}

		let newDayTimes: WeekDayTimes = {};
		for (let schedule of courseOutline.courseSchedule) {
			if (schedule.days == '') break;
			for (let day of schedule.days.split(', ')) {
				if (!schedule.startTime) throw schedule;
				if (!schedule.endTime) throw schedule;
				newDayTimes[day as WeekDayAbbreviations] = {
					startTime: schedule.startTime,
					endTime: schedule.endTime
				};
			}
		}
		return newDayTimes;
	}

	let weekDayTimes: WeekDayTimes | null = null;
	let isLoading = false;
	onMount(() => {
		isLoading = true;
		getCourseOutline({
			year,
			term,
			department,
			courseNumber: course.value,
			courseSection: courseSection.value
		})
			.then((data) => (weekDayTimes = createWeekDayTimes(data)))
			.catch(console.error)
			.finally(() => (isLoading = false));
	});
</script>

<th class={getRandomBorder()}>{courseSection.text}</th>
<td>{courseSection.sectionCode}</td>

{#if isLoading}
	<td colspan="5">Loading course schedules...</td>
{:else if weekDayTimes != null}
	<td>
		{#if weekDayTimes.Mo}
			<DayTimeDurationDisplay {...weekDayTimes.Mo} />
		{/if}
	</td>
	<td>
		{#if weekDayTimes.Tu}
			<DayTimeDurationDisplay {...weekDayTimes.Tu} />
		{/if}
	</td>

	<td>
		{#if weekDayTimes.We}
			<DayTimeDurationDisplay {...weekDayTimes.We} />
		{/if}
	</td>

	<td>
		{#if weekDayTimes.Th}
			<DayTimeDurationDisplay {...weekDayTimes.Th} />
		{/if}
	</td>

	<td>
		{#if weekDayTimes.Fr}
			<DayTimeDurationDisplay {...weekDayTimes.Fr} />
		{/if}
	</td>
{:else}
	<td colspan="5">This section does not have any schedule.</td>
{/if}
