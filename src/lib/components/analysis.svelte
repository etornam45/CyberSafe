<script lang="ts">
	import { io } from 'socket.io-client';
	import { Skeleton } from './ui/skeleton';
	import type { Analysis } from '$lib';
	import Card from './ui/card/card.svelte';
	import CardHeader from './ui/card/card-header.svelte';
	import CardTitle from './ui/card/card-title.svelte';
	import CardDescription from './ui/card/card-description.svelte';
	import CardContent from './ui/card/card-content.svelte';
	import CardFooter from './ui/card/card-footer.svelte';
	import Bubble from './bubble.svelte';
	import { Progress } from './ui/progress';
	import Label from './ui/label/label.svelte';

	let bullying: Analysis[] = [];
	const socket = io();

	socket.on('bullyingResponse', (res) => {
		console.log('Bullying detected', res);
		bullying = res;
		bullying = bullying.map((bully) => {
			bully.isBullying = bully.confidence > 0.5;
			return bully;
		});
		bullying = bullying.filter((bully) => bully.isBullying);
		bullying = bullying
	});

	const getBullyTypeIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'cyberbullying': return '💻';
			case 'verbal': return '🗣️';
			case 'physical': return '👊';
			case 'social': return '👥';
			default: return '⚠️';
		}
	};
</script>

<main class="p-4 space-y-6">
	{#if bullying.length > 0}
		{#each bullying as bull}
			{#if bull.isBullying == true}
				<Card class="border-red-500 border-2">
					<CardHeader>
						<div class="flex items-center space-x-2 text-red-500">
							<span class="text-2xl font-bold">⚠️</span>
							<CardTitle>Bullying Detected</CardTitle>
						</div>
						<CardDescription>
							{bull.analysis}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label class="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence</Label>
								<div class="flex items-center space-x-2">
									<Progress value={bull.confidence * 100} aria-label="Confidence" class="flex-grow" />
									<span class="text-sm font-medium">{(bull.confidence * 100).toFixed(0)}%</span>
								</div>
							</div>
							<div>
								<Label class="text-sm font-medium text-gray-500 dark:text-gray-400">Severity</Label>
								<div class="flex items-center space-x-2">
									<Progress value={bull.sensitivity * 100} aria-label="Severity" class="flex-grow" />
									<span class="text-sm font-medium">{(bull.sensitivity * 100).toFixed(0)}%</span>
								</div>
							</div>
						</div>

						<div class="mt-6 flex items-center space-x-4">
							<span class="text-4xl" title="{bull.type} Bullying">{getBullyTypeIcon(bull.type)}</span>
							<div>
								<h4 class="text-lg font-semibold">{bull.type} Bullying</h4>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									Bullies: {bull.bullies.join(', ')} | Victims: {bull.victim.join(', ')}
								</p>
							</div>
						</div>

						<div class="mt-6">
							<h4 class="text-lg font-semibold mb-4">Bullying Comments ({bull.conversation.length})</h4>
							{#each bull.conversation.filter(c => c.isBullyComment) as conversation}
								<div class="mb-3">
									<Bubble
										conversation={{
											id: conversation.id ?? Math.random().toString(36),
											speaker: conversation.speaker,
											message: conversation.message,
											timestamp: conversation.timestamp
										}}
									/>
								</div>
							{/each}
						</div>
					</CardContent>
					<CardFooter>
						<div class="w-full bg-red-100 dark:bg-red-900/50 p-3 rounded-md">
							<h5 class="text-md font-semibold text-red-700 dark:text-red-300 mb-2">Targeted Topics:</h5>
							<p class="text-sm text-red-700 dark:text-red-300">
								{bull.targets.join(' • ')}
							</p>
						</div>
					</CardFooter>
				</Card>
			{/if}
		{/each}
	{:else}
		<div class="flex flex-col space-y-4">
			<div class="flex items-center space-x-4">
				<Skeleton class="h-12 w-12 rounded-full" />
				<div class="space-y-2 flex-grow">
					<Skeleton class="h-4 w-full max-w-[250px]" />
					<Skeleton class="h-4 w-full max-w-[200px]" />
				</div>
			</div>
			<div class="space-y-2">
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-3/4" />
			</div>
			<div class="flex justify-end">
				<Skeleton class="h-8 w-20 rounded-full" />
			</div>
		</div>
	{/if}
</main>