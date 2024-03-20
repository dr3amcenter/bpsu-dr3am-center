<script lang="ts">
	import Dr3amLogoWhite from "$lib/assets/img/dr3am-logo-white.png";

	export let title: string;
</script>

<div class="container mb-8 sm:mb-10">
	<div class="flex h-[80px] items-center rounded-xl bg-primary px-4 sm:h-[90px] sm:px-8">
		<h1 class="text-lg font-medium text-primary-foreground">{title}</h1>
		<div class="ml-auto">
			<img
				src={Dr3amLogoWhite}
				alt="DR3AM Center Logo White"
				class="h-[45px] w-[45px] sm:h-[60px] sm:w-[60px]"
			/>
		</div>
	</div>
</div>
