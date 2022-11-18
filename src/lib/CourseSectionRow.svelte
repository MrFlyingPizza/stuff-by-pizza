<script lang="ts">
	import {
		getCourseOutline,
		type CourseOutline,
		type CourseSchedule
	} from './CourseOutlinesApiWrapper';
	import CourseSectionDay from './CourseSectionDay.svelte';

	export let year: string;
	export let term: string;
	export let department: string;
	export let courseNumber: string;
	export let courseSection: string;

	function toDays(schedule: CourseSchedule[]) {}

	let outline: CourseOutline;

	type Day = {
		startTime?: string;
		endTime?: string;
		active: boolean;
		abbr: string;
	};

	let days: Day[] = new Array(5);

	getCourseOutline(year, term, department, courseNumber, courseSection)
		.then((response) => (outline = response))
		.catch((error) => error);

	const abbrs = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
	$: {
		if (outline?.courseSchedule) {
			for (const s of outline.courseSchedule) {
				for (let i = 0; i < abbrs.length; i++) {
					if (s.days.includes(abbrs[i])) {
						days[i] = { active: true, abbr: abbrs[i] };
						if (s.startTime && s.endTime) {
							days[i].startTime = s.startTime;
							days[i].endTime = s.endTime;
						}
					}
				}
			}
		}
	}
</script>

<tr>
	<td class="section-box">
		{#if outline?.info?.outlinePath}
			<a href={'https://www.sfu.ca/outlines.html?' + outline.info.outlinePath}>
				{courseSection.toUpperCase()}
			</a>
		{:else}
			{courseSection.toUpperCase()}
		{/if}
	</td>
	<td>
		{#each days as day}
			<CourseSectionDay {...day} />
		{/each}
	</td>
</tr>

<style>
	.section-box {
		width: 30px;
		margin: none;
		padding: none;
		font-size: 10px;
	}
</style>
