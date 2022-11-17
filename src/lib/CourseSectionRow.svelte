<script lang="ts">
	import {
		getCourseOutline,
		type CourseOutline,
		type CourseSchedule
	} from './CourseOutlinesApiWrapper';

	export let year: string;
	export let term: string;
	export let department: string;
	export let courseNumber: string;
	export let courseSection: string;

	function toDays(schedule: CourseSchedule[]) {}

	let outline: CourseOutline;

	let days: boolean[] = [false, false, false, false, false];

	getCourseOutline(year, term, department, courseNumber, courseSection)
		.then((response) => (outline = response))
		.catch((error) => error);

	const abbrs = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
	$: {
		if (outline?.courseSchedule) {
			for (const s of outline.courseSchedule) {
				for (let i = 0; i < abbrs.length; i++) {
					if (s.days.includes(abbrs[i])) {
						days[i] = true;
					}
				}
			}
		}
	}
</script>

<table>
	<tr>
		<td class="day">{courseSection}</td>
		{#each days as day}
			<td class={'day ' + (day ? 'dayon' : 'dayoff')} />
		{/each}
	</tr>
</table>

<style>
	.day {
		border: 1px solid black;
		width: 50px;
	}

	.dayon {
		background-color: aqua;
	}

	.dayoff {
		background-color: black;
	}
</style>
