(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: '3cf4bce6-b6d0-40d4-9e09-91b60a34d4e3',
        query: 'What is a generic framework?',
        conversationHistory: []
      }),
    });

    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
