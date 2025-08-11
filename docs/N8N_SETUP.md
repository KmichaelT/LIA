# n8n Self-Hosted Integration (100% Free)

## Quick Setup with Docker

1. **Install n8n with Docker**
   ```bash
   docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
   ```

2. **Access n8n**
   - Open http://localhost:5678
   - Create admin account

3. **Create Workflow**
   - Add "Webhook" node as trigger
   - Configure webhook URL: `http://your-domain.com:5678/webhook/zeffy`
   - Add "HTTP Request" node
   - Configure to POST to your Strapi endpoint

4. **Configure Zeffy**
   - In Zeffy admin, set webhook URL to your n8n webhook
   - n8n will receive data and forward to Strapi

## Deploy to Free Services

### Option A: Railway.app (Free Tier)
```bash
# Deploy to Railway (free tier)
git clone https://github.com/n8n-io/n8n-railway-template
# Follow Railway deployment guide
```

### Option B: Render.com (Free Tier)
```bash
# Deploy to Render (free tier)
# Use their n8n template
```