import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
})

export default app;