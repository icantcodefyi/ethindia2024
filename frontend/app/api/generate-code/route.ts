import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import fs from 'fs/promises'
import path from 'path'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Load knowledge base
async function loadKnowledgeBase(language: 'ink' | 'move') {
  const filePath = path.join(process.cwd(), `knowledge-base/${language}_contracts.json`)
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function POST(request: Request) {
  try {
    const { language, prompt } = await request.json()

    if (!language || !prompt) {
      return NextResponse.json({ error: 'Missing language or prompt' }, { status: 400 })
    }

    if (!['ink', 'move'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
    }

    // Load the knowledge base
    const knowledgeBase = await loadKnowledgeBase(language);
    console.log(knowledgeBase);

    // Create the system message with knowledge base context
    const systemMessage = `You are an expert ${language.toUpperCase()} smart contract developer. 
    Use this knowledge base as reference: ${JSON.stringify(knowledgeBase)}, the user will ask query from the knowledge base only so it will be easy to make the code.
    Generate accurate and efficient code based on the user's request. 
    Only genearate the code which you know will 100% compile please.
    make sure that you do not use arthemetic operations, instead make functions for them like if u want to add token then make a .add function or something with int functionality or something but no arthemetic operation`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    })

    const generatedCode = completion.choices[0].message.content

    return NextResponse.json({ 
      code: generatedCode,
      usage: completion.usage
    })

  } catch (error) {
    console.error('Error generating code:', error)
    return NextResponse.json({ error: 'Error generating code' }, { status: 500 })
  }
}

