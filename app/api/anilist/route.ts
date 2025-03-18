export async function fetchAnimeCover(animeTitle: string) {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          title {
            romaji
          }
          coverImage {
            large
          }
        }
      }
    `;

    const variables = { search: animeTitle };

    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return data?.data?.Media?.coverImage?.large || "";
}
