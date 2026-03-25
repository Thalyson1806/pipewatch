#!/bin/bash
# Simula um ciclo completo de cards no Pipefy para demonstração

BASE="http://localhost:5000/webhook/pipefy"

send() {
  curl -s -X POST "$BASE" \
    -H "Content-Type: application/json" \
    -d "$1" | python3 -m json.tool
  sleep 0.8
}

echo "==> Pipe: Vendas"

send '{
  "data": {
    "action": "card.create",
    "card": {
      "id": "101",
      "title": "Proposta para Empresa Alpha",
      "pipe": { "id": "1", "name": "Vendas" },
      "current_phase": { "id": "10", "name": "Novo Lead" }
    }
  }
}'

send '{
  "data": {
    "action": "card.move",
    "card": {
      "id": "101",
      "title": "Proposta para Empresa Alpha",
      "pipe": { "id": "1", "name": "Vendas" },
      "current_phase": { "id": "11", "name": "Qualificação" }
    }
  }
}'

send '{
  "data": {
    "action": "card.move",
    "card": {
      "id": "101",
      "title": "Proposta para Empresa Alpha",
      "pipe": { "id": "1", "name": "Vendas" },
      "current_phase": { "id": "12", "name": "Proposta Enviada" }
    }
  }
}'

send '{
  "data": {
    "action": "card.done",
    "card": {
      "id": "101",
      "title": "Proposta para Empresa Alpha",
      "pipe": { "id": "1", "name": "Vendas" },
      "current_phase": { "id": "13", "name": "Fechado" }
    }
  }
}'

echo ""
echo "==> Pipe: Suporte"

send '{
  "data": {
    "action": "card.create",
    "card": {
      "id": "202",
      "title": "Bug no módulo de pagamento",
      "pipe": { "id": "2", "name": "Suporte" },
      "current_phase": { "id": "20", "name": "Aberto" }
    }
  }
}'

send '{
  "data": {
    "action": "card.late",
    "card": {
      "id": "202",
      "title": "Bug no módulo de pagamento",
      "pipe": { "id": "2", "name": "Suporte" },
      "current_phase": { "id": "20", "name": "Aberto" }
    }
  }
}'

send '{
  "data": {
    "action": "card.move",
    "card": {
      "id": "202",
      "title": "Bug no módulo de pagamento",
      "pipe": { "id": "2", "name": "Suporte" },
      "current_phase": { "id": "21", "name": "Em Andamento" }
    }
  }
}'

echo ""
echo "==> Pipe: RH"

send '{
  "data": {
    "action": "card.create",
    "card": {
      "id": "303",
      "title": "Entrevista - Dev Sênior",
      "pipe": { "id": "3", "name": "Recrutamento" },
      "current_phase": { "id": "30", "name": "Triagem" }
    }
  }
}'

send '{
  "data": {
    "action": "card.move",
    "card": {
      "id": "303",
      "title": "Entrevista - Dev Sênior",
      "pipe": { "id": "3", "name": "Recrutamento" },
      "current_phase": { "id": "31", "name": "Entrevista Técnica" }
    }
  }
}'

send '{
  "data": {
    "action": "card.expired",
    "card": {
      "id": "304",
      "title": "Onboarding - Carlos Silva",
      "pipe": { "id": "3", "name": "Recrutamento" },
      "current_phase": { "id": "32", "name": "Documentação" }
    }
  }
}'

echo ""
echo "Todos os eventos enviados!"
