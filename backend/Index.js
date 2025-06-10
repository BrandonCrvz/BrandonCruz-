require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensaje requerido' });

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 300,
    });

    const responseMessage = completion.data.choices[0].message.content;
    res.json({ reply: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
