import type { Conversation } from "$lib";

export function CheckCyberBullying(conversation: Conversation[], options: { type: string, targetType: string }) {
    console.log(conversation);

    const maxRetries = 3;
    let retryCount = 0;

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                conversationHistory: conversation,
                type: options.type,
                targetType: options.targetType
            }
        })
    };

    function fetchWithRetries(): Promise<any> {
        return fetch('http://127.0.0.1:3400/CyberBullying?stream=true', fetchOptions)
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Retrying (${retryCount}/${maxRetries})...`);
                    return fetchWithRetries();
                } else {
                    throw new Error(`Failed after ${maxRetries} retries`);
                }
            });
    }

    return fetchWithRetries();
}