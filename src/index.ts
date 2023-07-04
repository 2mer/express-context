import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import createContext from './createContext';

const app = express()
const port = 3000

const ExpressContext = createContext<{ res: Response, req: Request, next: NextFunction }>();
const ExpressContextProvider: RequestHandler = (req, res, next) => {
	ExpressContext.run({ req, res, next }, next)
}

type Logger = { log: (message: string) => void };
const LoggerContext = createContext<Logger>();
const LoggerProvider = () => {
	const { req, next } = ExpressContext.use()

	const log = (message: string) => {
		console.log(`[${req.path}]: ${message}`)
	}

	LoggerContext.run({ log }, next)
}

// Attach provider
app.use(ExpressContextProvider);
app.use(LoggerProvider);



app.get('/', () => {
	const { res } = ExpressContext.use();
	const logger = LoggerContext.use();

	logger.log('Hi from route logger');

	res.send('Hello World!')
})

app.get('/hello', () => {
	const { res } = ExpressContext.use();
	const logger = LoggerContext.use();

	logger.log('Hi from other route logger');

	res.send('Hello from other World!')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})