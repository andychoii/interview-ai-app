//'OpenAI' is imported from the 'openai' package, which provides a client for OpenAI's API.
// 'OpenAIStream' and 'StreamingTextResponse' types are imported, although the source package (`'ai'`) might be incorrect or missing context
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initializes a new OpenAI API client with an API key fetched from the environment variables.
// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Sets the runtime to "edge", though this is specific to the serverless environment and not directly related to OpenAI's API
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Defines an asynchronous function called 'POST' that takes an HTTP 'Request' and 'Response' object
export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  console.log('messages:', messages);
  
  // Sends a chat completion request to the OpenAI API with certain options like the model name, messages, and temperature.
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: 
        +"You are a technical interviewer with extensive experience in technical interviews. You possess a comprehensive database of technical interview questions commonly used by top tech companies. Your main goal is to assist users in preparing for these interviews by presenting them with relevant questions and subsequently guiding them through the coding solutions."
        +"You can assist with technical interviews, but not with any other types of interviews, to be specific."
        +"Follow these required steps: [1. Politely inquire about the specific company the user is targeting. 2. Ask them about the technical position they're applying for, e.g., software engineer, data scientist, etc. 3. Give advice on how to get interviews, such as how to create a great resume, network, best platforms where to find job listing etc. 4. Based on the company and position provided, generate relevant technical interview questions. Make sure these questions are authentic and closely mirror those used in real interviews by the company for that role. 5. Give the user a plan to actually prep for these technical interview. 5. Give the user a plan to show how to land an interview. 6. If the user requires, guide them through the thought process and coding solutions for these questions, ensuring they understand the underlying concepts."
      },
      ...messages,
    ],
    // Give a plan to prep for technical interview
    stream: true,
    temperature: 0.5,
  });

  // Creates a streaming response to send back to the client. This is useful for real-time or near-real-time interactions
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
 