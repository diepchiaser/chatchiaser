import { ReadableStreamDefaultReader } from 'stream/web'

interface StreamConfigV2 {
    /**
     * Type of API
     * - 'openai': Format of OpenAI API (separated by newline)
     * - 'pollinations': Format of Pollinations API (separated by space)
     * - 'aryahcr': Format of AryahCR API (separated by \u001e)
     * - 'default': Default format (separated by newline)
     */
    type?: 'openai' | 'pollinations' | 'aryahcr' | 'default'

    /**
     * Delay between each chunk
     */
    delay?: number
}

export async function createStreamResponseV2(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    config: StreamConfigV2 = {}
) {
    const {
        type = 'default',
        delay = 0
    } = config

    if (!reader) {
        return new Response(JSON.stringify({ message: "No response body" }), {
            status: 500
        })
    }

    // Get config based on type
    const getConfig = (type: string) => {
        switch (type) {
            case 'pollinations':
                return {
                    delimiter: ' ',
                    processChunk: (chunk: string) => chunk ? chunk + ' ' : null
                }
            case 'aryahcr':
                return {
                    delimiter: '\u001e',
                    processChunk: (chunk: string, previousContent: string) => {
                        try {
                            const parsed = JSON.parse(chunk)
                            if (parsed.message && parsed.message !== previousContent) {
                                return parsed.message.slice(previousContent.length)
                            }
                            return null
                        } catch (e) {
                            return null
                        }
                    }
                }
            case 'openai':
                return {
                    delimiter: '\n',
                    processChunk: (chunk: string) => {
                        if (chunk.startsWith('data: ')) {
                            const jsonStr = chunk.slice(6)
                            if (jsonStr === '[DONE]') return null
                            try {
                                const parsed = JSON.parse(jsonStr)
                                return parsed.choices?.[0]?.delta?.content || null
                            } catch (e) {
                                return null
                            }
                        }
                        return null
                    }
                }
            default:
                return {
                    delimiter: '\n',
                    processChunk: (chunk: string) => {
                        // Handle special case for [DONE]
                        if (chunk === '[DONE]' || chunk === 'data: [DONE]') return null

                        // Remove 'data: ' prefix
                        const content = chunk.replace(/^data:\s*/, '')

                        try {
                            const parsed = JSON.parse(content)

                            // Handle Pollinations API
                            if (parsed.choices?.[0]?.delta?.content) {
                                return parsed.choices[0].delta.content
                            }
                            if (parsed.message && typeof parsed.message === 'string') {
                                return parsed.message
                            }
                            if (parsed.content && typeof parsed.content === 'string') {
                                return parsed.content
                            }
                            if (typeof parsed === 'string') {
                                return parsed
                            }

                            return null
                        } catch (e) {
                            // Return content as is if not JSON
                            return content
                        }
                    }
                }
        }
    }

    const { delimiter, processChunk } = getConfig(type)

    const encoder = new TextEncoder()
    console.log("Encoder: ", encoder)
    const decoder = new TextDecoder()
    console.log("Decoder: ", decoder)
    let buffer = ""
    let previousContent = ""

    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                while (true) {
                    const { done, value } = await reader.read()
                    console.log("Value: ", value)

                    if (done) {
                        controller.close()
                        break
                    }

                    const text = decoder.decode(value)
                    console.log("Text: ", text)
                    buffer += text

                    const chunks = buffer.split(delimiter)
                    buffer = chunks.pop() || ""

                    for (const chunk of chunks) {
                        const trimmedChunk = chunk.trim()
                        if (!trimmedChunk) continue

                        try {
                            const content = processChunk(trimmedChunk, previousContent)
                            console.log("Content: ", content)

                            if (content) {
                                controller.enqueue(encoder.encode(content))
                                previousContent = content

                                if (delay > 0) {
                                    await new Promise(resolve => setTimeout(resolve, delay))
                                }
                            }
                        } catch (error) {
                            console.error('Process error:', error)
                            console.error('Problem chunk:', chunk)
                            continue
                        }
                    }
                }
            } catch (error) {
                console.error('Stream error:', error)
                controller.error(error)
            }
        }
    })

    return new Response(readableStream, {
        headers: { 'Content-Type': 'text/plain' }
    })
}

interface StreamConfigV1 {
    /**
     * Chunk handler
     */
    chunkHandler?: (chunk: string) => string | null

    /**
     * Delimiter
     */
    delimiter?: string

    /**
     * Delay
     */
    delay?: number
}

export async function createStreamResponseV1(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    config: StreamConfigV1 = {}
) {
    const {
        chunkHandler,
        delimiter = '\n',
        delay = 0
    } = config

    if (!reader) {
        return new Response(JSON.stringify({ message: "No response body" }), {
            status: 500
        })
    }

    const encoder = new TextEncoder()
    console.log("Encoder: ", encoder)
    const decoder = new TextDecoder()
    console.log("Decoder: ", decoder)
    let buffer = ""
    let previousContent = ""

    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                while (true) {
                    const { done, value } = await reader.read()
                    console.log("Value: ", value)

                    if (done) {
                        controller.close()
                        break
                    }

                    const text = decoder.decode(value)
                    buffer += text

                    const chunks = buffer.split(delimiter)
                    buffer = chunks.pop() || ""

                    for (const chunk of chunks) {
                        if (!chunk.trim()) continue

                        try {
                            let content: string | null = null

                            if (chunkHandler) {
                                content = chunkHandler(chunk)
                            } else {
                                const parsed = JSON.parse(chunk.replace(/^data: /, ''))

                                if (parsed.error) {
                                    throw new Error(parsed.error)
                                }

                                if (parsed.finish) {
                                    controller.close()
                                    return
                                }

                                if (parsed.choices?.[0]?.delta?.content) {
                                    content = parsed.choices[0].delta.content
                                }

                                else if (parsed.message && parsed.message !== previousContent) {
                                    content = parsed.message.slice(previousContent.length)
                                    previousContent = parsed.message
                                }
                            }
                            console.log("Content: ", content)

                            if (content) {
                                controller.enqueue(encoder.encode(content))
                                if (delay > 0) {
                                    await new Promise(resolve => setTimeout(resolve, delay))
                                }
                            }

                        } catch (error) {
                            console.error('Parse error:', error)
                            console.error('Problem chunk:', chunk)
                            continue
                        }
                    }
                }
            } catch (error) {
                console.error('Stream error:', error)
                controller.error(error)
            }
        }
    })

    return new Response(readableStream, {
        headers: { 'Content-Type': 'text/plain' }
    })
}
