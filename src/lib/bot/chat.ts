async function query(data: { question: string }) {
  const response = await fetch(
    "https://flowise.ounai.org/api/v1/prediction/a9a28f06-52be-4ae9-aa63-2fdb46b7db99",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

export default query;
