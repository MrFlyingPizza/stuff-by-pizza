<script lang="ts">
	import { scale } from 'svelte/transition';

	export let startTime: string;
	export let endTime: string;
	export let maxHours = 22;
	export let minHours = 7;

	/**
	 * Converts a time in the 24-hour format of hh:mm to the number of hours passed since 00:00.
	 * @param time Time string in the format of hh:mm.
	 */
	function timeToHours(time: string) {
		const [hours, minutes] = time.split(':').map((value) => parseInt(value));
		return hours + minutes / 60;
	}

	let leftMarginPercent = 0;
	let widthPercent = 0;
	$: {
		const startHours = timeToHours(startTime);
		const endHours = timeToHours(endTime);
		const duration = endHours - startHours;
		const maxDuration = maxHours - minHours;
		leftMarginPercent = Math.round(((startHours - minHours) / maxDuration) * 100);
		widthPercent = Math.round((duration / maxDuration) * 100);
	}
</script>

<div class="progress" in:scale>
	<div
		class="bar variable-bar"
		style={`margin-left: ${leftMarginPercent}%; width: ${widthPercent}%`}
	>
		<p>{startTime}</p>
		<p>{endTime}</p>
	</div>
</div>

<style lang="scss">
	.variable-bar {
		border-left: 2px solid;
		border-right: 2px solid;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}
</style>
