import type { User } from "lucia";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const USER_CTX = "USER_CTX";

export function setUserState(initialData: User) {
	const userState = writable(initialData);
	setContext(USER_CTX, userState);

	return userState;
}

export function getUserState() {
	return getContext<Writable<User>>(USER_CTX);
}
