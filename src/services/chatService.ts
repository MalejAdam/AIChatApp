import axios from "axios";

export async function sendMessage(messageText: string): Promise<string> {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: messageText }],
                // stream: true,
                store: true,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error in chat service:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error?.message || 'Error communicating with OpenAI');
        }
        throw new Error('Unknown error occurred');
    }
}
