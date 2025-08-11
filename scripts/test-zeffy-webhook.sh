#!/bin/bash

# Test script for Zeffy webhook endpoint
# Usage: ./test-zeffy-webhook.sh [STRAPI_URL]

# Configuration
STRAPI_URL=${1:-"https://best-desire-8443ae2768.strapiapp.com"}
WEBHOOK_SECRET="ZeffyWebhook2025SecureToken_LoveInAction_!@#$RandomString789xyz"
ENDPOINT="${STRAPI_URL}/api/zeffy/webhook"

echo "======================================"
echo "ZEFFY WEBHOOK TEST"
echo "======================================"
echo "Testing endpoint: ${ENDPOINT}"
echo ""

# Test 1: Valid webhook payload
echo "Test 1: Valid donation webhook..."
curl -X POST "${ENDPOINT}" \
  -H 'Content-Type: application/json' \
  -H "X-Auth-Token: ${WEBHOOK_SECRET}" \
  -d '{
    "transaction_id": "test_tr_123_'$(date +%s)'",
    "amount": 50.00,
    "currency": "USD",
    "frequency": "monthly",
    "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "form_name": "Child Sponsorship Test",
    "utm": {
      "source": "test",
      "medium": "curl",
      "campaign": "webhook_test"
    },
    "donor": {
      "first_name": "Test",
      "last_name": "Sponsor",
      "email": "test.sponsor@example.com",
      "phone": "+1 555-123-4567"
    },
    "address": {
      "line1": "123 Test Street",
      "city": "Test City",
      "country": "US"
    },
    "custom_questions": [
      {
        "question": "Sponsorship ID",
        "answer": "CHILD-TEST-001"
      }
    ]
  }'

echo -e "\n\n"

# Test 2: Duplicate transaction (should return duplicate: true)
echo "Test 2: Duplicate transaction test..."
curl -X POST "${ENDPOINT}" \
  -H 'Content-Type: application/json' \
  -H "X-Auth-Token: ${WEBHOOK_SECRET}" \
  -d '{
    "transaction_id": "test_tr_123_'$(date +%s)'",
    "amount": 50.00,
    "currency": "USD",
    "frequency": "monthly",
    "created_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "form_name": "Child Sponsorship Test",
    "donor": {
      "first_name": "Test",
      "last_name": "Sponsor",
      "email": "test.sponsor@example.com"
    }
  }'

echo -e "\n\n"

# Test 3: Invalid secret (should return 401)
echo "Test 3: Invalid secret test (should return 401)..."
curl -X POST "${ENDPOINT}" \
  -H 'Content-Type: application/json' \
  -H "X-Auth-Token: wrong_secret" \
  -d '{
    "transaction_id": "test_invalid_secret",
    "amount": 25.00,
    "currency": "USD",
    "donor": {
      "email": "test@example.com"
    }
  }'

echo -e "\n\n"

# Test 4: Missing required fields (should return 400)
echo "Test 4: Missing transaction_id (should return 400)..."
curl -X POST "${ENDPOINT}" \
  -H 'Content-Type: application/json' \
  -H "X-Auth-Token: ${WEBHOOK_SECRET}" \
  -d '{
    "amount": 25.00,
    "currency": "USD",
    "donor": {
      "email": "test@example.com"
    }
  }'

echo -e "\n\n"

echo "======================================"
echo "Test completed!"
echo ""
echo "Expected results:"
echo "- Test 1: {'ok': true}"
echo "- Test 2: {'ok': true, 'duplicate': true}"
echo "- Test 3: 401 Unauthorized"
echo "- Test 4: 400 Bad Request"
echo ""
echo "Check your Strapi admin panel for new:"
echo "- Sponsor: test.sponsor@example.com"
echo "- Donation: with test transaction ID"
echo "======================================"