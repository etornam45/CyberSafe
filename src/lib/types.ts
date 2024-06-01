export interface Conversation {
    id: string;
    speaker: string;
    message: string;
    timestamp: string;
}

export interface Analysis {
    analysis: string;
    isBullying: boolean;
    victim: string[];
    bullies: string[];
    targets: string[];
    type: string;
    sensitivity: number;
    confidence: number;
    conversation: OutputConversation[];
}

interface OutputConversation {
    id: string;
    speaker: string;
    message: string;
    timestamp: string;
    analysis: Analysis;
    isBullyComment: boolean;
}