export async function delay(milliseconds: number): Promise<void> {
	return new Promise((res) => {
		setTimeout(() => {
			res(undefined);
		}, milliseconds);
	});
}
