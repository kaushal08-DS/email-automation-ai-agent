# Email Automation AI Agent

Production-oriented starter for a personal AI email assistant. It uses a Next.js frontend and FastAPI backend, Google OAuth + Gmail API, OpenRouter for AI classification/style/reply drafting, Razorpay for subscriptions, and SQLAlchemy with SQLite locally or PostgreSQL in production.

## What is included
- Google login with Gmail read + send scopes
- Writing-style onboarding and relearning
- Gmail inbox synchronization
- AI classification: replies / promotional / other
- Human approval before sending replies
- Promotional explanations
- Deadline/alert detection
- Dashboard and insights
- Razorpay subscription plans: ₹400 / ₹1,100 / ₹2,200 / ₹4,000
- Backend subscription enforcement
- Encrypted Gmail refresh tokens
- HTTP-only login cookie
- User-isolated database records
- Render deployment configuration

## APIs / credentials you need
1. Google Cloud Console
   - Create a project.
   - Enable Gmail API and Google People API (or OAuth userinfo support).
   - Configure OAuth consent screen.
   - Create a Web application OAuth client.
   - Local redirect URI: `http://localhost:8000/auth/google/callback`
   - Production redirect URI: `https://YOUR-BACKEND.onrender.com/auth/google/callback`
   - Put client ID and secret in backend `.env`.
   - The application requests `gmail.readonly` and `gmail.send`. It does not request delete/modify Gmail permissions.

2. OpenRouter
   - Create an API key.
   - Set `OPENROUTER_API_KEY`.
   - Set `OPENROUTER_MODEL` to a model you have access to. The default is `openai/gpt-4o-mini` through OpenRouter.

3. Razorpay
   - Get Key ID and Key Secret from Razorpay.
   - Put them in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
   - Create a webhook using the production backend URL: `https://YOUR-BACKEND.onrender.com/api/payments/webhook`.
   - Put the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
   - Test with Razorpay test keys first. Switch to live keys only after the full payment flow is verified.

4. PostgreSQL for production
   - Create a Render PostgreSQL database and use its internal/external connection string as `DATABASE_URL`.
   - Local development uses SQLite automatically if you keep the example setting.

5. Secrets
   - `JWT_SECRET`: long random string.
   - `TOKEN_ENCRYPTION_KEY`: Fernet key. Generate locally with:
     `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`

## Run locally in VS Code
### Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```
Edit `.env` before using Google/AI/payment features.

### Frontend
Open a second terminal:
```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```
Open `http://localhost:3000`.

## Render deployment
### 1. Push the whole folder to GitHub
Create a repository and push `backend`, `frontend`, `README.md` and `.gitignore`.

### 2. Create Render PostgreSQL
Create a PostgreSQL database in Render and copy its connection string.

### 3. Deploy backend
Create a Render Web Service:
- Root Directory: `backend`
- Runtime: Python
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Set backend environment variables from `backend/.env.example`.

### 4. Deploy frontend
Create another Render Web Service:
- Root Directory: `frontend`
- Runtime: Node
- Build: `npm install && npm run build`
- Start: `npm start`

Set `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com`.

### 5. Finish Google OAuth
After you know the backend Render URL, add:
`https://YOUR-BACKEND.onrender.com/auth/google/callback`
inside the Google OAuth client's Authorized redirect URIs.
Set `GOOGLE_REDIRECT_URI` to the same URL.
Set `FRONTEND_URL` to your frontend Render URL.

### 6. Razorpay webhook
Set Razorpay webhook URL to:
`https://YOUR-BACKEND.onrender.com/api/payments/webhook`
Use the same webhook secret in Render.

## Important production notes
- Gmail refresh tokens are encrypted in the database.
- Never commit `.env` files, API keys, Google secrets or Razorpay secrets.
- Use HTTPS in production.
- For a larger production workload, add a background worker/queue for Gmail synchronization instead of doing all AI processing in one HTTP request.
- The current starter intentionally does not delete or modify Gmail messages.
- Email sending always requires an explicit final user action.
- Subscription access is checked on the backend, not just in the UI.
