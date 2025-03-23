export async function fetchGameCover(title: string): Promise<string> {
    const res = await fetch('/api/igdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Failed to fetch game cover");

    const data = await res.json();
    return data.coverUrl;
}
