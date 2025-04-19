
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { prompt, type, projectData } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    let systemPrompt = "You are a helpful assistant.";
    let userPrompt = prompt;
    
    // Set appropriate system prompts based on request type
<<<<<<< HEAD
    if (type === "generate_project") {
      systemPrompt = "You are a project manager assistant. Break down PRD documents into concrete, actionable tasks and subtasks. Create practical, specific tasks needed to implement the described project.";
    } else if (type === "recommendations") {
      systemPrompt = "You are a productivity coach specialized in software development. Analyze the project and task information and provide specific, actionable recommendations to help complete the project efficiently.";
      userPrompt = `Based on the following project and tasks information, provide 3-5 specific recommendations: ${JSON.stringify(projectData)}\n\nUser query: ${prompt}`;
=======
    if (type === "generate_project" && projectData?.prd) {
      systemPrompt = "You are a project manager assistant. Your task is to analyze PRD documents and break them down into concrete, actionable tasks and subtasks. Create practical, specific tasks that would be needed to implement the described project.";
    } else if (type === "recommendations") {
      systemPrompt = "You are a productivity coach specialized in software development. Analyze the project and task information provided and give specific, actionable recommendations to help complete the project efficiently.";
      
      // Construct detailed context including project details, tasks, and subtasks
      let projectContext = "Project Details:\n";
      if (projectData?.project) {
        projectContext += `- Name: ${projectData.project.name}\n`;
        projectContext += `- Description: ${projectData.project.description}\n`;
        if (projectData.project.notes) projectContext += `- Notes: ${projectData.project.notes}\n`;
      }
      if (projectData?.tasks && projectData.tasks.length > 0) {
        projectContext += "\nTasks:\n" + projectData.tasks.map((task: any) => `- ${task.name}: ${task.description}`).join('\n');
      }
      userPrompt = `Based on the following project information, provide 3-5 specific recommendations to help complete this project efficiently:\n\n${projectContext}\n\nUser query: ${prompt}`;
>>>>>>> 21ce918 (Fix: [Describe the errors fixed])
    }

    console.log(`Making OpenAI request for type: ${type}`);

    if (type === "generate_project" && projectData?.prd) {
      // For project generation, send the PRD content as the user prompt
      userPrompt = `Analyze the following PRD and generate a list of tasks and subtasks required to complete the project:\n\n${projectData.prd}`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    console.log("OpenAI response status:", response.status);
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    // Extract the response content
    const result = data.choices[0].message.content;
    console.log("OpenAI result received");

    // Parse the result if it's a project generation request
    if (type === "generate_project") {
      try {
        // Attempt to parse the generated tasks from the AI response
        const parsedTasks = parseAIGeneratedTasks(result);
        console.log(`Parsed ${parsedTasks.length} tasks from AI response`);
        
        return new Response(
          JSON.stringify({ 
            result, 
            parsedTasks 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error parsing AI response:", error);
        return new Response(
          JSON.stringify({ 
            result,
            error: "Failed to parse AI response into tasks format" 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to parse AI response into tasks and subtasks
function parseAIGeneratedTasks(aiResponse: string): any[] {
  const tasks = [];
  
  // Split by numbered items or bullet points with regex
  const taskSections = aiResponse.split(/\n\s*(?:\d+[\.\)]\s*|\-\s*|\*\s*)/g).filter(Boolean);
  
  for (let i = 0; i < taskSections.length; i++) {
    const section = taskSections[i].trim();
    if (!section) continue;
    
    // Extract the task name (first line) and description (remaining lines)
    const lines = section.split('\n');
    const name = lines[0].replace(/^[^a-zA-Z0-9]*/, '').trim();
    const description = lines.slice(1).join('\n').trim();
    
    // Look for subtasks indicated by - or * or numbered lists
    const subtaskMatches = description.match(/(?:\n|\r|\r\n)(?:\s*[\-\*]\s*|\s*\d+[\.\)]\s*)[^\n\r]*/g) || [];
    const subtasks = subtaskMatches.map(match => 
      match.replace(/^(?:\n|\r|\r\n)\s*(?:[\-\*]|\d+[\.\)])\s*/, '').trim()
    ).filter(Boolean);
    
    // If no subtasks were extracted, try to check if there are colons followed by lists
    let extractedSubtasks = subtasks;
    if (subtasks.length === 0 && description.includes(':')) {
      const colonSections = description.split(':');
      if (colonSections.length > 1) {
        const potentialSubtaskSection = colonSections[1];
        extractedSubtasks = potentialSubtaskSection
          .split(/(?:\n|\r|\r\n)\s*(?:[\-\*]|\d+[\.\)])\s*/)
          .map(s => s.trim())
          .filter(Boolean);
      }
    }
    
    tasks.push({
      name,
      description: description.replace(/(?:\n|\r|\r\n)(?:\s*[\-\*]\s*|\s*\d+[\.\)]\s*)[^\n\r]*/g, '').trim(),
      subtasks: extractedSubtasks.map(st => ({ name: st }))
    });
  }
  
  return tasks;
}
