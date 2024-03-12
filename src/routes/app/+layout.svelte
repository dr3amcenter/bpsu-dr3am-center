<script lang="ts">
	import { cn } from "$lib/utils";
	import Button from "$lib/components/ui/button/button.svelte";
	import { LogOutIcon, MenuIcon, UserIcon } from "lucide-svelte";
	import * as Avatar from "$lib/components/ui/avatar";

	import Dr3amCenterLogoBig from "$lib/assets/img/d3am-logo-big.png";

	let sidebarOpen = false;
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
			"fixed left-0 top-0 z-[100] h-screen w-72 -translate-x-full border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0",
			sidebarOpen ? "translate-x-0" : "-translate-x-full"
		)}
	>
		<div class="flex h-full flex-col px-3 py-6">
			<Button
				variant="ghost"
				size="icon"
				class="sm:hidden"
				on:click={() => (sidebarOpen = !sidebarOpen)}
			>
				<MenuIcon />
			</Button>

			<div class="flex justify-center">
				<img src={Dr3amCenterLogoBig} alt="DR3AM Center Logo Big" class="w-40" />
			</div>

			<div class="mt-12">
				<!-- {#each activeLinks as link}
					<NavLink href={link.href} name={link.label}>
						<svelte:component this={link.icon} class="h-5 w-5" />
					</NavLink>
				{/each} -->
			</div>

			<div class="mt-auto space-y-4 border-t py-4">
				<a href="/app/profile" class="flex items-center gap-x-3">
					<Avatar.Root>
						<Avatar.Fallback><UserIcon /></Avatar.Fallback>
					</Avatar.Root>
					<div>
						<div class="text-xs">John Carlo Asilo</div>
						<div class="text-xs uppercase text-gray-500">Admin</div>
					</div>
				</a>

				<form method="post" action="/logout">
					<input type="hidden" />
					<Button size="lg" type="submit" variant="destructive" class="w-full justify-start">
						<LogOutIcon class="mr-2 h-4 w-4 " />
						Logout
					</Button>
				</form>
			</div>
		</div>
	</aside>

	<!-- <header class="flex h-20 items-center justify-between bg-white px-2 py-4 sm:ml-72 xl:px-4">
		<Button variant="ghost" class="sm:hidden" on:click={() => (sidebarOpen = !sidebarOpen)}>
			<MenuIcon />
		</Button>
	</header> -->

	<div class="py-10 sm:ml-72"><slot /></div>
</div>
