const { Configuration, OpenAIApi } = require("openai");

const chat = async (prompt, text) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: prompt },
        {role: "user", content: text },
      ],
    });
    return completion.data.choices[0].message;
  } catch (err) {
    console.error("Error al conectar con OpenAI:", JSON.stringify(err.response?.data || err.message, null, 2));
    return "Lo siento, ocurrió un error al procesar tu consulta.";
  }
  
  
};

module.exports = chat;
