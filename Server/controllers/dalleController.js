const { Configuration, OpenAIApi } = require('openai');
//---------------OpenAi Config---------------//
let openAi;
try {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  openAi = new OpenAIApi(configuration);
} catch (err) {
  console.error('Failed to connect with Dalle API');
  console.error(err);
}
//---------------Controller------------------//
exports.postRequest = async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openAi.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    if (error.response) res.status(500).send(error.response.data.error.message);
    res.status(500).send('Something went wrong');
  }
};
