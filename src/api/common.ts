import { getRandomValues } from "node:crypto";

export function newID() {
	return Buffer.from(getRandomValues(new Uint8Array(16))).toString("hex").slice(0, 16);
}
