<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import { LogOutIcon, MenuIcon, UserIcon } from "lucide-svelte";
	import * as Avatar from "$lib/components/ui/avatar";
	import { page } from "$app/stores";
	import { links } from "$lib/config";
	import Dr3amCenterLogoBig from "$lib/assets/img/dr3am-logo-big.webp";
	import NavLink from "$lib/components/nav-link.svelte";
	import ScannerDialog from "$lib/components/scanner-dialog.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import Dr3amLogo from "$lib/assets/img/dr3am-logo.png";
	import { setUserState } from "$lib/store.js";

	export let data;

	const user = setUserState(data.user!);

	let sidebarOpen = false;

	$: activeLinks = links[$user.role];

	$: if ($page.url.pathname) {
		sidebarOpen = false;
	}
</script>

<div>
	{#if sidebarOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 sm:hidden"
			role="none"
			on:click={() => (sidebarOpen = false)}
		/>
	{/if}

	<aside
		class={cn(
			"fixed left-0 top-0 z-50 h-screen w-64 -translate-x-full bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 md:translate-x-0",
			sidebarOpen ? "translate-x-0" : "-translate-x-full"
		)}
	>
		<div class="flex h-full flex-col px-3 pb-14 pt-6">
			<Button
				variant="ghost"
				size="icon"
				class="md:hidden"
				on:click={() => (sidebarOpen = !sidebarOpen)}
			>
				<MenuIcon />
			</Button>

			<div class="mb-12 flex justify-center">
				<img src={Dr3amCenterLogoBig} alt="DR3AM Center Logo Big" class="w-40" />
			</div>

			<ScrollArea class="flex-1">
				{#each activeLinks as link}
					<NavLink href={link.href} label={link.label} sublinks={link.sublinks}>
						<svelte:component this={link.icon} class="h-4 w-4" />
					</NavLink>
				{/each}
			</ScrollArea>

			<div class="space-y-4 border-t py-4">
				<div class="flex items-center gap-x-3">
					<Avatar.Root>
						<Avatar.Fallback><UserIcon /></Avatar.Fallback>
					</Avatar.Root>
					<div>
						<div class="text-xs">{$user.fullName}</div>
						<div class="text-xs uppercase text-gray-500">{$user.role}</div>
					</div>
				</div>

				<form method="post" action="/logout">
					<input type="hidden" />
					<Button
						size="lg"
						type="submit"
						class="w-full justify-center bg-red-100 text-red-400 hover:bg-red-100/90 hover:text-red-400"
					>
						<LogOutIcon class="mr-2 h-4 w-4 " />
						Logout
					</Button>
				</form>

				<div class="text-xs text-gray-300">
					Inventory's data is based on information collected starting from April 4, 2024.
				</div>
			</div>
		</div>
	</aside>

	<header
		class="fixed flex h-20 w-full items-center justify-between bg-white px-6 py-4 md:ml-64 md:hidden xl:px-4"
	>
		<img src={Dr3amLogo} alt="DR3AM Center Logo" class="w-12" />

		<Button variant="ghost" class="sm:hidden" on:click={() => (sidebarOpen = !sidebarOpen)}>
			<MenuIcon />
		</Button>
	</header>

	<div class="pb-20 pt-32 md:ml-64 md:mt-20 md:pb-24 md:pt-0"><slot /></div>
</div>

<ScannerDialog />
