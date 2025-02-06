import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { description, tags } = await request.json()

    // Combine description and tags into a single prompt
    const prompt = `${description} ${tags.join(', ')}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `top 5 and only 5 most animes similar to ${prompt} or has elements of ${prompt}. 
          the answer can be anime movies and anime shows, but no manga or books, etc. 
          answer only in titles and descriptions, the description being two sentences only. 
          the format of the 5 should be: [title] ~ [description] | [title] ~ [description] | [title] ~ [description] | [title] ~ [description] | [title] ~ [description]. 
          no markdown formatting, only plain text`,
        },
      ],
      store: true,
    })

    return NextResponse.json({
      recommendations: completion.choices[0].message.content
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}