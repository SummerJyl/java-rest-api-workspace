// This API simulation fails 60% of the time to test your retry logic
function fakeApiCall() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.6 
        ? resolve({id: 1, name: "User Data"}) 
        : reject(new Error("API request failed"));
    }, 500);
  });
}

// Helper function to create a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUserWithRetry() {
  const maxAttempts = 3;
  const delayMs = 1000;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Try the API call
      const result = await fakeApiCall();
      console.log(`Success on attempt ${attempt}!`);
      return result;
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      
      // If this was the last attempt, throw the error
      if (attempt === maxAttempts) {
        throw new Error(`All ${maxAttempts} attempts failed. Last error: ${error.message}`);
      }
      
      // Wait before retrying (but not after the last attempt)
      console.log(`Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }
}

// Test it out
async function test() {
  try {
    const userData = await fetchUserWithRetry();
    console.log("Final result:", userData);
  } catch (error) {
    console.log("Final error:", error.message);
  }
}

test();