# Development

- Install dependencies with `npm install --legacy-peer-deps`
- Create a `.env` file based on the `.env.example` file
- Run the development server with `npm run dev`
- Open [http://localhost:3000](http://localhost:3000) in your browser

# Deployment

To refresh the data, run the following command:

```bash
curl -X POST http://localhost:3000/api/refresh -H "Authorization: Bearer your-secret-api-key"
```
