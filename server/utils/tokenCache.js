const tokenCache = new Map();
const tokenQueue = [];
const MAX_CACHE_SIZE = process.env.MAX_CACHE_SIZE;

export const getCachedUser = (token) => {
    const cached = tokenCache.get(token);
    if(cached) {
        tokenQueue.splice(tokenQueue.indexOf(token), 1);
        tokenQueue.push(token);
    }

    return cached ? cached.user : null;
};

export const setCachedUser = (token, user) => {
    if(tokenQueue.length >= MAX_CACHE_SIZE){
        const oldest = tokenQueue.shift();
        tokenCache.delete(oldest);
    }

    tokenCache.set(token, { user, timestamp: Date.now()});
    tokenQueue.push(token);
};

export const clearCache = () => {
    tokenCache.clear();
    tokenQueue.length = 0;
}