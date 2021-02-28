#!/bin/bash

echo "RIOT_TOKEN=$RIOT_TOKEN" > .env
echo "PORT=$PORT" >> .env
echo "MONGODB_URL=$MONGODB_URL" >> .env
echo "JWT_SECRET=$JWT_SECRET" >> .env