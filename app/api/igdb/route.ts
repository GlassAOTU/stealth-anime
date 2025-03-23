export async function POST(req: Request) {
    const { title } = await req.json();

    const clientId = process.env.IGDB_CLIENT_ID!;
    const accessToken = process.env.IDGB_ACCESS_TOKEN!;

    const igdbRes = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'text/plain'
        },
        body: `
        search "${title}";
        fields name, cover.image_id;
        limit 1;
      `
    });

    const data = await igdbRes.json();

    if (!data?.[0]?.cover?.image_id) {
        return new Response(JSON.stringify({ coverUrl: null }), { status: 404 });
    }

    const imageId = data[0].cover.image_id;
    const imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;

    return new Response(JSON.stringify({ coverUrl: imageUrl }), { status: 200 });
}
