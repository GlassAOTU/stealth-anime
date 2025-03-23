type GameDetails = {
    coverUrl: string | null;
    description: string | null;
};

export async function fetchGameDetails(title: string): Promise<GameDetails> {
    const res = await fetch('/api/igdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Failed to fetch game details");

    const data = await res.json();
    return data; // now properly typed
}
