self.onmessage = function(e) {
	const { sharedBuffer } = e.data;
	const sharedArray = new Int32Array(sharedBuffer);

	while (Atomics.load(sharedArray, 0) !== 123) ;
	console.log('notified');
}