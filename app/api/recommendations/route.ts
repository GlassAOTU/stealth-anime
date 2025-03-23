import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
    const { description, tags } = await req.json();

    const prompt = `You are a game recommendation engine.
                    Based on the following input, recommend exactly 5 distinct games, matching the described themes or genres, and/or the provided tags.
                    Do not recommend any pornographic games.
                    Only allow games from the same franchise if the description explicitly allows it.
                    Include both modern and classic games where appropriate.
                    Format the response as:
                    [title] | [title] | [title] | [title] | [title]
                    Respond in plaintext only. No extra commentary.

                    Input:
                    Description: ${description || "None"}
                    Tags: ${tags.length ? tags.join(", ") : "None"}`
    ;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });

        const reply = completion.choices[0]?.message?.content?.trim();

        return NextResponse.json({ recommendations: reply });
    } catch (error) {
        console.error("OpenAI error:", error);
        return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
    }
}
