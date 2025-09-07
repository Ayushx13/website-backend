import express from "express";
import morgan from "morgan";
import authRouter from "./routers/authRouter.js";
import voteRouter from "./routers/voteRouter.js";
import adminRouter from "./routers/adminRouter.js";
import songRouter from "./routers/songRouter.js";
import messageRouter from "./routers/messageRouter.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/globalError.js";

const app = express();
app.use(express.json());

//1) Global MIDDLEWARE

//Development logging
if ((process.env.NODE_ENV || "").trim() === "development") {
    app.use(morgan('dev'));
}

// 2)ROUTES
app.use('/api/v1/fresherParty', authRouter);
app.use('/api/v1/fresherParty/vote', voteRouter);
app.use('/api/v1/fresherParty/admin', adminRouter);
app.use('/api/v1/fresherParty/songs', songRouter);
app.use('/api/v1/fresherParty/messages', messageRouter);

// If route not found
app.all('/{*any}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler at the end
app.use(globalErrorHandler);

export {app} ;