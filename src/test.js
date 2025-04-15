/*fetch("https://v0-landing-page-creation-ph50guf3m-daesols-projects.vercel.app/api/process-agent", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-vercel-protection-bypass': 'LMBxeHzI5Ke5gZiOnM5bgRqJiJ9Yp7RL'
  },
  body: JSON.stringify({
    validationId: "123",
    agentType: "problem",
    businessIdea: "test",
    additionalContext: {}
  }),
})
.then(response => {
  console.log("Status:", response.status);
  console.log("Content-Type:", response.headers.get("content-type"));
  
  // Clone the response to use it twice
  const responseClone = response.clone();
  
  // First try to get the raw text
  return responseClone.text().then(text => {
    console.log("Raw response:", text.substring(0, 500)); // Show first 500 chars
    
    // If it's JSON content type, also try to parse as JSON
    if (response.headers.get("content-type")?.includes("application/json")) {
      return response.json();
    } else {
      throw new Error("Received non-JSON response");
    }
  });
})
.then(data => {
  console.log("JSON Response:", data);
})
.catch(error => {
  console.error("Error:", error);
});*/