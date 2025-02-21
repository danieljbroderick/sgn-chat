# AI Chatbot for SquareUp Website

A secure AI chatbot implementation that can be easily integrated with SquareUp websites. The chatbot is powered by OpenAI's GPT-3.5 model and is deployed on Vercel.

## Features 1

- Secure API with CORS protection and API key validation
- Modern, responsive chat widget
- Easy integration with SquareUp websites
- Real-time AI-powered responses

## Prerequisites

- Node.js 18+ installed
- Vercel account
- OpenAI API key
- SquareUp website access

## Environment Variables

Create a `.env` file with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_secure_api_key
ALLOWED_ORIGINS=https://your-squareup-domain.com,http://localhost:3000
NODE_ENV=development
```

## Deployment Instructions

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Deploy to Vercel:
   ```bash
   vercel
   ```
4. Set up environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the environment variables from your `.env` file

## Integration with SquareUp

1. In your SquareUp website editor, add a Custom HTML block
2. Add the following script tag (replace with your actual Vercel deployment URL):

```html
<script src="https://your-vercel-app.vercel.app/chatbot-widget.js"></script>
```

3. Update the API_URL and API_KEY variables in the chatbot-widget.js file to match your deployment

## Security

The chatbot implementation includes several security measures:

1. CORS Protection:
   - Only allows requests from specified domains
   - Configurable through ALLOWED_ORIGINS environment variable

2. API Key Validation:
   - All API requests require a valid API key
   - API key must be included in x-api-key header

3. Rate Limiting:
   - Implemented through Vercel's built-in rate limiting

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Test the chatbot at http://localhost:3000

## Customization

The chatbot widget can be customized by modifying the CSS in `public/chatbot-widget.js`. The widget is designed to work within SquareUp's limitations while maintaining a modern appearance.

## Troubleshooting

1. CORS Issues:
   - Ensure your domain is listed in ALLOWED_ORIGINS
   - Check that the protocol (http/https) matches exactly

2. API Key Issues:
   - Verify the API key in the widget matches the one in your environment variables
   - Check that the key is being sent in the x-api-key header

3. Widget Not Appearing:
   - Check browser console for JavaScript errors
   - Verify the script URL is correct and accessible

## Support

For issues and feature requests, please create an issue in this repository.
