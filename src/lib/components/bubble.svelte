<script lang="ts">
	import type { Conversation } from '$lib/types';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	export let conversation: Conversation;
	$: isUser = conversation.speaker === 'User';
	$: avatarSeed = isUser ? 'user' : conversation.speaker;
</script>

<div class="flex mb-4 {isUser ? 'justify-end' : 'justify-start'}">
	{#if !isUser}
		<div class="w-8 h-8 rounded-full mr-2 self-end mb-1">
			<Avatar.Root class="w-full h-full">
				<Avatar.Image
					src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${avatarSeed}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
					alt="avatar"
				/>
				<Avatar.Fallback>{conversation.speaker[0] ?? 'X'}</Avatar.Fallback>
			</Avatar.Root>
		</div>
	{/if}
	<div class="flex flex-col max-w-[70%]">
		<div
			class="flex flex-col gap-1 p-2 rounded-lg
                {isUser
				? 'bg-blue-500 text-white rounded-br-none self-end'
				: 'bg-gray-100 dark:bg-gray-700 rounded-bl-none self-start'}"
		>
			<p class="text-sm {isUser ? 'text-white' : 'text-gray-800 dark:text-white'}">
				{conversation.message}
			</p>
			<span class="text-xs self-start {isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}"
				>{#if !isUser}
					<span class="text-sm text-gray-500 dark:text-gray-400"
						>{conversation.speaker}</span
					>
				{/if}
				{new Date(conversation.timestamp).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
				})}
			</span>
		</div>
	</div>
	{#if isUser}
		<div class="w-8 h-8 rounded-full ml-2 self-end mb-1">
			<Avatar.Root class="w-full h-full">
				<Avatar.Image
					src="https://api.dicebear.com/8.x/open-peeps/svg?seed=user&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"
					alt="avatar"
				/>
				<Avatar.Fallback>U</Avatar.Fallback>
			</Avatar.Root>
		</div>
	{/if}
</div>
<!-- <div class="flex flex-col gap-2 border rounded-md my-2 p-2">
	<div class="flex gap-2">
		<div class="w-8 h-8 rounded-full ">
			<Avatar.Root class="w-full h-full">
				<Avatar.Image src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${conversation.speaker}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`} alt="avatar" />
				<Avatar.Fallback>{conversation.speaker[0] ?? "X"}</Avatar.Fallback>
			</Avatar.Root>
		</div>
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-1">
				<span class="font-bold text-gray-800 dark:text-white">{conversation.speaker}</span>
				<span class="text-gray-500 text-sm dark:text-gray-400"
					>{new Date(conversation.timestamp).toLocaleTimeString()}</span
				>
			</div>
			<p class="text-gray-800 dark:text-white">{conversation.message}</p>
		</div>
	</div>
</div> -->
