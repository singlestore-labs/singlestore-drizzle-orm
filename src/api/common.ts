export function generateRandomID(length: number) {
	// generate random string with a certain length, containing only alphanumeric chars
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	let res = "";
	for (let i = 0; i < length; i++) {
		res += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	return res;
}
