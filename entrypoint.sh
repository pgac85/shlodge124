#!/usr/bin/env bash

rand() {
  cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
}

# Try to use mongo docker link for MONGODB_ vars
if [ -n "$MONGO_PORT" ] && [ -z "$MONGODB_HOST" ] && [ -z "$MONGODB_PORT" ]; then
  MONGO_HOST_PORT="${MONGO_PORT#tcp:\/\/}"
  export MONGODB_HOST="${MONGO_HOST_PORT%:*}"
  export MONGODB_PORT="${MONGO_HOST_PORT#*:}"
fi

# Ensure NODE_ENV is set
[ -n "$NODE_ENV" ] || export NODE_ENV="production"

# Run CMD from docker
exec "$@"