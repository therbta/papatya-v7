# Vercel API Configuration for PAPATYA v7

## API Token
```
VERCEL_TOKEN=WTOTxZa3X4zjspqFh5Uifd7k
```

## Project Domain
- **Primary Domain**: sibertr.online
- **Vercel Domain**: papatya-v7.vercel.app (auto-generated)

## API Usage Examples

### 1. Monitor Deployment Logs
```bash
# Get deployment logs
curl -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  https://api.vercel.com/v6/deployments/[deployment-id]/logs

# Get project deployments
curl -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  https://api.vercel.com/v6/deployments?projectId=[project-id]
```

### 2. Environment Variables Management
```bash
# List environment variables
curl -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  https://api.vercel.com/v9/projects/[project-id]/env

# Set environment variable
curl -X POST \
  -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  -H "Content-Type: application/json" \
  -d '{"key":"VITE_FIREBASE_API_KEY","value":"your-value","target":"production"}' \
  https://api.vercel.com/v9/projects/[project-id]/env
```

### 3. Domain Management
```bash
# Add custom domain
curl -X POST \
  -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  -H "Content-Type: application/json" \
  -d '{"name":"sibertr.online"}' \
  https://api.vercel.com/v9/projects/[project-id]/domains
```

### 4. Project Information
```bash
# Get project details
curl -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  https://api.vercel.com/v9/projects/[project-id]

# List all projects
curl -H "Authorization: Bearer WTOTxZa3X4zjspqFh5Uifd7k" \
  https://api.vercel.com/v9/projects
```

## Environment Variables Structure

### Production Environment
```env
VITE_FIREBASE_API_KEY=AIzaSyDEUlEbRH7aBLE1zYe3v5LX2Hl8dzrvKYU
VITE_FIREBASE_AUTH_DOMAIN=software-802.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=software-802
VITE_FIREBASE_STORAGE_BUCKET=software-802.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=319606435977
VITE_FIREBASE_APP_ID=1:319606435977:web:51d0019b6974cc514ad658
VITE_FIREBASE_MEASUREMENT_ID=G-D5MV71ZT97
NODE_ENV=production
VITE_APP_DOMAIN=sibertr.online
```

### Development Environment
```env
NODE_ENV=development
VITE_APP_DOMAIN=localhost:5173
```

## Monitoring Scripts

### deployment-monitor.js
```javascript
const VERCEL_TOKEN = 'WTOTxZa3X4zjspqFh5Uifd7k';
const PROJECT_ID = 'papatya-v7'; // Replace with actual project ID

async function getDeploymentStatus() {
  const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}`, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  });
  
  const data = await response.json();
  console.log('Latest deployment:', data.deployments[0]);
}

async function getEnvironmentVariables() {
  const response = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/env`, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  });
  
  const data = await response.json();
  console.log('Environment variables:', data.envs);
}

// Run monitoring
getDeploymentStatus();
getEnvironmentVariables();
```

## Domain Configuration

### DNS Settings for sibertr.online
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### Vercel Domain Setup
1. Add sibertr.online as custom domain in Vercel dashboard
2. Configure DNS records as shown above
3. SSL certificate will be auto-generated

## Deployment Commands

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login with token
vercel login --token WTOTxZa3X4zjspqFh5Uifd7k

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_APP_DOMAIN production
```

### Automated Deployment
```bash
# GitHub Actions workflow
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Logging and Monitoring

### Real-time Logs
```bash
# Stream deployment logs
vercel logs [deployment-url] --follow

# Get function logs
vercel logs [function-name] --follow
```

### Performance Monitoring
- Vercel Analytics (built-in)
- Firebase Analytics (configured)
- Custom logging via console.log (visible in Vercel dashboard)

## Security Notes
- Keep VERCEL_TOKEN secure
- Use environment variables for sensitive data
- Enable Vercel's built-in security features
- Configure Firebase security rules
- Use HTTPS for all communications
