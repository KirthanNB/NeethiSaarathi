import { Configuration, BrowserUseApi } from '@gobii-ai/client';

async function main() {
  // Initialize client
  const api = new BrowserUseApi(new Configuration({
    headers: { 'X-Api-Key': 'NIx7JSwpd_yDSpj9fimMY-a_dR5qZyL17kPS18q5ChQ' }
  }));

  try {
    // Create agent
    const agent = await api.createAgent({ name: 'QuickStart Agent' });
    console.log(`Agent created with ID: ${agent.id}`);

    // Assign task
    const task = await api.assignTask(agent.id, { 
      prompt: "Visit https://www.myscheme.gov.in/ and extract the main heading" 
    });
    console.log(`Task assigned with ID: ${task.id}`);

    // Wait for result
    let attempts = 0;
    while (attempts < 20) { // Timeout after ~100 seconds
      const result = await api.getTaskResult(agent.id, task.id);

      if (result.status === "completed") {
        console.log("Result:", result.result);
        break;
      } else if (result.status === "failed" || result.status === "cancelled") {
        console.log(`Task ${result.status}:`, result.error_message);
        break;
      }

      console.log(`Status: ${result.status}...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();