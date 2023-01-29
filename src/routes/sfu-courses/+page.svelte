<script lang="ts">
	import CourseTable from '$lib/CourseTable.svelte';
	import {
		getDepartments,
		getTerms,
		getYears,
		type Department,
		type Term,
		type Year
	} from '$lib/course-outlines-api';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data: {
		year: string | undefined;
		term: string | undefined;
		department: string | undefined;
	};

	let year = data.year;
	let term = data.term;
	let department = data.department;

	let isMounted = false;

	function updateLocalStorage(key: string, value: string | null) {
		if (value == null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, value);
		}
	}

	$: if (browser) {
		updateLocalStorage('year', year ? year : null);
		updateLocalStorage('term', term ? term : null);
		updateLocalStorage('department', department ? department : null);
	}

	let years: Year[] = [];
	let terms: Term[] = [];
	let departments: Department[] = [];

	onMount(() => {
		getYears()
			.then((data) => (years = data.reverse()))
			.catch(console.error);
	});

	let termsController: AbortController;
	$: if (year) {
		termsController?.abort();
		termsController = new AbortController();
		getTerms({ year }, termsController.signal)
			.then((data) => (terms = data))
			.catch(console.error);
	}

	let departmentsController: AbortController;
	$: if (year && term) {
		departmentsController?.abort();
		departmentsController = new AbortController();
		getDepartments({ year, term }, departmentsController.signal)
			.then((data) => (departments = data))
			.catch(console.error);
	}
</script>

<div class="container-lg">
	<h1>SFU Course Outlines List</h1>
	<h6>Cuz im fed up with the sfu website.</h6>
	<div>
		<div class="row">
			{#if years.length > 0}
				<div class="col">
					<label for="yearSelect">Year</label>
					<select id="yearSelect" bind:value={year}>
						{#each years as yearOption}
							<option value={yearOption.value}>{yearOption.text}</option>
						{/each}
					</select>
				</div>
			{/if}
			{#if terms.length > 0}
				<div class="col">
					<label for="termSelect">Term</label>
					<select id="termSelect" bind:value={term} disabled={year == null}>
						{#each terms as termOption}
							<option value={termOption.value}>{termOption.text}</option>
						{/each}
					</select>
				</div>
			{/if}
			{#if departments.length > 0}
				<div class="col">
					<label for="departmentSelect">Department</label>
					<select
						id="departmentSelect"
						bind:value={department}
						disabled={year == null || term == null}
					>
						{#each departments as departmentOption}
							<option value={departmentOption.value}>{departmentOption.text}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>
	</div>
	<div class="table-container">
		{#if year && term && department}
			<CourseTable {year} {term} {department} />
		{/if}
	</div>
</div>

<style lang="scss">
	.table-container {
		overflow-x: auto;
	}
</style>
