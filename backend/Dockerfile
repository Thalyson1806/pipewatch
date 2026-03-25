FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

# Cloud Run expõe na porta 8080 por padrão
ENV PORT=8080

CMD ["./entrypoint.sh"]
