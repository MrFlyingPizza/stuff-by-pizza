<script lang="ts">
	export let startTime = '';
	export let endTime = '';
	export let width = 200;
	export let height = 20;
	export let active = false;
	export let abbr = '';

	const startTimeOffset = 0;
	const endTimeOffset = 0;
	const totalHours = 24 - startTimeOffset - endTimeOffset;

	function parseHours(time: string): number {
		const [hours, minute] = time.split(':').map((v) => parseInt(v));
		return hours + minute / 60;
	}

	let canvas: HTMLCanvasElement;
	$: context = canvas?.getContext('2d');

	$: {
		if (context) {
			context.fillStyle = '#EEEEEE';
			context.fillRect(0, 0, width, height);

			if (active) {
				context.fillStyle = 'orange';
				context.fillRect(0, 0, width, height);
			}
			if (startTime && endTime) {
				const startRatio = (parseHours(startTime) - startTimeOffset) / 24;
				const endRatio = (parseHours(endTime) + endTimeOffset) / 24;
				const start = width * startRatio;
				const end = width * endRatio;
				const length = end - start;
				context.fillStyle = 'black';
				context.fillRect(start, 0, length, height);
				context.fillStyle = 'white';
				context.font = `${height}px Consolas`;
				context.fillText(abbr, 0, height * 0.9, width);
			}

			const increment = width / totalHours;
			for (let i = 0; i < totalHours; i++) {
				context.fillStyle = i == 0 ? 'black' : '#EEEEEE';
				context.fillRect(i * increment, 0, 1, height);
			}
		}
	}
</script>

<canvas bind:this={canvas} {width} {height} />
