export async function POST(req: Request) {
    const { title } = await req.json();

    const clientId = process.env.IGDB_CLIENT_ID!;
    const accessToken = process.env.IGDB_ACCESS_TOKEN!;

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'text/plain',
        },
        body: `
        search "${title}";
        fields name, cover.image_id, summary;
        limit 1;
      `,
    });

    const data = await igdbRes.json();
    const game = data?.[0];

    if (!game) {
        return new Response(JSON.stringify({ error: 'Game not found' }), { status: 404 });
    }

    const imageId = game?.cover?.image_id;
    const imageUrl = imageId
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`
        : null;

    return new Response(
        JSON.stringify({
            coverUrl: imageUrl,
            description: game?.summary ?? null,
        }),
        { status: 200 }
    );
}
