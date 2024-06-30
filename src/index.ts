export interface Env {
	AI: Ai;
}

export default {
	async fetch(request, env): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		try {
			const { prompt } = (await request.json()) as { prompt: string };

			if (!prompt) {
				return new Response('Prompt is required', { status: 400 });
			}

			const inputs = { prompt };
			const aiResponse = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);

			const headers = new Headers();
			headers.set('Content-Type', 'image/png');
			headers.set('Access-Control-Allow-Origin', '*');

			return new Response(aiResponse, {
				status: 200,
				headers: headers,
			});
		} catch (error) {
			return new Response('Invalid request', { status: 400 });
		}
	},
} satisfies ExportedHandler<Env>;
