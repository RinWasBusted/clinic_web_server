# Important

Developers only focus on all service files

```
cache.service.ts   Basic caching service with key-value pairs
rbac.service.ts    RBAC caching service
```

Used Redis as the caching solution, so the Redis server must be running and accessible. You can set up a local Redis server or use a cloud-based Redis service. Check the `src/services/redis/readme.md` file for more details on setting up the Redis server and configuring the connection settings.
