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
		weekDayBarSize: string | undefined;
	};

	let year = data.year;
	let term = data.term;
	let department = data.department;
	let weekDayBarSize = data.weekDayBarSize ? parseInt(data.weekDayBarSize) : 10;

	function updateLocalStorage(key: string, value: string | null) {
		if (value == null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, value);
		}
	}

	$: if (browser) {
		updateLocalStorage('year', year ? year : null);
	}

	$: if (browser) {
		updateLocalStorage('term', term ? term : null);
	}

	$: if (browser) {
		updateLocalStorage('department', department ? department : null);
	}

	$: if (browser) {
		updateLocalStorage('weekDayBarSize', weekDayBarSize.toString());
	}

	function handleTermChange() {
		department = undefined;
	}

	function handleYearChange() {
		term = undefined;
		handleTermChange();
	}

	let years: Year[] = [];
	onMount(() => {
		getYears()
			.then((data) => (years = data.reverse()))
			.catch(console.error);
	});

	let termsController: AbortController;
	let terms: Term[] = [];
	$: if (year) {
		terms = [];
		termsController?.abort();
		termsController = new AbortController();
		getTerms({ year }, termsController.signal)
			.then((data) => (terms = data))
			.catch(console.error);
	}

	let departmentsController: AbortController;
	let departments: Department[] = [];
	$: if (year && term) {
		departments = [];
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
			<div class="col">
				<div class="form-group">
					<label for="year-select">Year</label>
					<select id="year-select" bind:value={year} on:change={handleYearChange}>
						{#each years as yearOption}
							<option value={yearOption.value}>{yearOption.text}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="col">
				<div class="form-group">
					<label for="term-select">Term</label>
					<select
						id="term-select"
						disabled={year == undefined}
						bind:value={term}
						on:change={handleTermChange}
					>
						{#each terms as termOption}
							<option value={termOption.value}>{termOption.text}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="col">
				<div class="form-group">
					<label for="department-select">Department</label>
					<select id="department-select" disabled={term == undefined} bind:value={department}>
						{#each departments as departmentOption}
							<option value={departmentOption.value}>{departmentOption.text}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="col">
				<div class="form-group">
					<label for="weekday-bar-size">Weekday Bar Size</label>
					<input
						id="weekday-bar-size"
						class="input-block"
						type="range"
						name="bar-size"
						min="0"
						max="100"
						bind:value={weekDayBarSize}
					/>
					<output id="weekday-bar-size-output" for="weekday-bar-size">{weekDayBarSize}%</output>
				</div>
			</div>
		</div>
	</div>
	{#if year && term && department}
		<div class="table-container">
			<CourseTable
				{year}
				{term}
				{department}
				weekDayBarWidth={100 + (weekDayBarSize / 100) * 1000}
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	.table-container {
		overflow-x: auto;
		min-height: 80vh;
	}

	select {
		min-width: 6em;
	}

	input[type='range'] {
		width: 200px;
	}
</style>
