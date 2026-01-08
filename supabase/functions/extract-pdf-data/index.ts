import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:application/pdf;base64,${base64}`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use Lovable AI to extract data from PDF
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a data extraction assistant. Extract placement/job-related information from company registration forms. Extract these fields if present:
- job_roles: Job titles/positions offered (comma-separated)
- package_offered: Salary/CTC details
- eligibility_criteria: Academic requirements (CGPA, branches, backlogs, etc.)
- bond_details: Any service agreement or bond requirements
- job_location: Work locations
- selection_process: Hiring process steps

Return ONLY valid JSON with these exact field names. Use null for fields not found.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract the job/placement details from this registration form PDF.'
              },
              {
                type: 'image_url',
                image_url: { url: dataUrl }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_form_data',
              description: 'Extract structured data from registration form',
              parameters: {
                type: 'object',
                properties: {
                  job_roles: { type: 'string', description: 'Job titles/positions offered' },
                  package_offered: { type: 'string', description: 'Salary/CTC/package details' },
                  eligibility_criteria: { type: 'string', description: 'Academic requirements like CGPA, branches, backlogs' },
                  bond_details: { type: 'string', description: 'Service agreement or bond info' },
                  job_location: { type: 'string', description: 'Work locations offered' },
                  selection_process: { type: 'string', description: 'Hiring process steps' }
                },
                required: ['job_roles', 'package_offered', 'eligibility_criteria', 'bond_details', 'job_location', 'selection_process']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_form_data' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    // Extract the function call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      // Try to parse from content if tool call not present
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          return new Response(
            JSON.stringify({ success: true, data: parsed }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch {
          console.error('Failed to parse content as JSON:', content);
        }
      }
      throw new Error('No extraction result from AI');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error extracting PDF data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to extract data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
