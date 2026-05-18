# Important

This project uses Redis to cache data. This requires a Redis server to be running and accessible.
You can set up a local Redis server or use a cloud-based Redis service

# Installation

To install the Redis server, you can follow the instructions provided in this link:
https://redis.io/docs/latest/operate/oss_and_stack/install/

In the contributor's environment, the server is installed in Ubuntu v22.04 with APT package manager.

## Server config

| Parameter | Value                                        |
| --------- | -------------------------------------------- |
| URL       | `redis://localhost:6379` |

# Configuration

The Redis connection settings are configured in the `redis.config.ts` file and now use `REDIS_URL`.

```typescript
{
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
}
```

After installing the server, start the command to run the Redis server:

```bash
sudo systemctl start redis # Ubuntu
```

# Quick references

This repository uses node-redis as the Redis client library.

Document: https://redis.js.org/
