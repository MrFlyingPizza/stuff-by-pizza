<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card, { Content } from '@smui/card';
	import Select, { Option } from '@smui/select';
	import CourseTable from '$lib/CourseTable.svelte';
	import {
		getDepartments,
		getTerms,
		getYears,
		type Department,
		type Term,
		type Year
	} from '$lib/CourseOutlinesApiWrapper';
	import { year, term, department } from './options';

	/** @type {import('./$types').PageData} */
	export let data;

	$year = data.year;
	$term = data.term;
	$department = data.department;

	let yearOptions: Year[] = [];
	let termOptions: Term[] = [];
	let departmentOptions: Department[] = [];

	getYears().then((response) => (yearOptions = response));

	let termOptionsAbortController: AbortController;

	$: {
		termOptionsAbortController?.abort();
		if ($year) {
			termOptionsAbortController = new AbortController();
			getTerms($year, termOptionsAbortController).then(
				(response) => (termOptions = response)
			);
		}
	}

	let departmentOptionsAbortController: AbortController;

	$: {
		departmentOptionsAbortController?.abort();
		if ($year && $term) {
			departmentOptionsAbortController = new AbortController();
			getDepartments($year, $term, departmentOptionsAbortController)
				.then((response) => (departmentOptions = response))
				.catch((error) => error);
		}
	}

	$: {
		yearOptions.sort((a, b) => Number.parseInt(b.value) - Number.parseInt(a.value));
	}
</script>

<LayoutGrid>
	<Cell span={12}>
		<Card variant="outlined">
			<Content>
				<Select bind:value={$year} label="Year">
					{#each yearOptions as yearOption}
						<Option value={yearOption.value}>{yearOption.text}</Option>
					{/each}
				</Select>
				<Select disabled={termOptions.length <= 0} bind:value={$term} label="Term">
					{#each termOptions as termOption}
						<Option value={termOption.value}>{termOption.text}</Option>
					{/each}
				</Select>
				<Select
					disabled={departmentOptions.length <= 0}
					bind:value={$department}
					label="Department"
				>
					{#each departmentOptions as departmentOption}
						<Option value={departmentOption.value}>{departmentOption.text}</Option>
					{/each}
				</Select>
			</Content>
		</Card>
	</Cell>
	<Cell span={12}>
		{#if $year && $term && $department}
			<CourseTable year={$year} term={$term} department={$department} />
		{/if}
	</Cell>
</LayoutGrid>
