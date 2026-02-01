
import { GoogleGenAI } from "@google/genai";
import { ArchNode, ArchLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getTrafficExplanation(nodes: ArchNode[], links: ArchLink[], focusNode?: string) {
  const model = 'gemini-3-pro-preview';
  
  const nodesContext = nodes.map(n => `${n.name} (${n.type}): ${n.description}`).join('\n');
  const linksContext = links.map(l => `${l.source} connects to ${l.target} via ${l.label}`).join('\n');
  
  const prompt = `
    Analyze the following cloud architecture:
    
    NODES:
    ${nodesContext}
    
    CONNECTIONS:
    ${linksContext}
    
    ${focusNode ? `Focus specifically on the traffic flowing through: ${focusNode}.` : 'Provide a comprehensive end-to-end traffic flow analysis.'}
    
    Please provide:
    1. A step-by-step technical explanation of how data travels through this system.
    2. Security considerations at each hop (mTLS, IAM roles, firewalls).
    3. Performance/Latency bottlenecks.
    
    Format the response as clear Markdown with headings. Use bullet points for steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate explanation. Please check your network or API configuration.";
  }
}
