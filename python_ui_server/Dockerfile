FROM python:3.11-slim

WORKDIR /app

# Copy all application files (including requirements.txt)
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (as set by Uvicorn)
EXPOSE 8000

# Run FastAPI via Uvicorn, evaluating dynamic PORT injected by hosts like Railway
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
