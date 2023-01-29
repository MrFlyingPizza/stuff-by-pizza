export function getRandomBorder() {
	const variants = ['', 'border-2', 'border-3', 'border-4', 'border-5', 'border-6'];
	return 'border ' + variants[Math.floor(Math.random() * variants.length)];
}
