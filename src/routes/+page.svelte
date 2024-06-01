<script lang="ts">
	import type { Conversation } from '$lib';
	import { io } from 'socket.io-client';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onMount } from 'svelte';
	import Bubble from '$lib/components/bubble.svelte';

	let name = '';
	let message = '';
	let conversations = new Map<string, Conversation>();
	let open = true;

	onMount(() => {
		if (name.length! === 0 || name == '') {
			console.log('name', name, name.length!);
			open = true;
		} else {
			open = false;
		}
	});

	const socket = io();


	socket.on('eventFromServer', (message: Conversation | Conversation[]) => {
		if (Array.isArray(message)) {
			conversations = new Map([
				...conversations,
				...message.map((msg) => [msg.id, msg] as [string, Conversation])
			]) as Map<string, Conversation>;
		} else {
			conversations = new Map([...conversations, [message.id, message]]);
		}
	});

	function handleSubmit() {
		socket.emit('eventFromClient', {
			id: Math.random().toString(36),
			speaker: name,
			message,
			timestamp: new Date().toISOString()
		} as Conversation);
		message = ''; // clear the form
	}

	function onOpenChange() {
		if (name.length! === 0 || name == '') {
			console.log('name', name, name.length!);
			open = true;
		} else {
			open = false;
		}
	}
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create a User</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-2 w-full">
			<div class="grid items-center gap-4 w-full">
				<Input id="username" bind:value={name} placeholder="@peduarte" class=" w-full" />
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={onOpenChange} type="submit" class="w-full">Done</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<main class="relative h-full">
	<header
		class="sticky top-0 inset-x-0 font-sans font-bold p-2 backdrop-blur-sm border-b border-collapse flex items-center justify-between"
	>
		<p>CyberSafe</p>

		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</header>
	<ul class="h-full p-4">
		{#each Array.from(conversations.values()) as conversation}
			<Bubble bind:conversation />
		{/each}
	</ul>
	<form
		class="sticky bottom-0 inset-x-0 grid w-full gap-2 p-4"
		on:submit|preventDefault={handleSubmit}
	>
		<Label for="message">Message:: {name}</Label>
		<Textarea placeholder="Type your message here." bind:value={message} />
		<Button type="submit">Send message</Button>
	</form>
</main>
