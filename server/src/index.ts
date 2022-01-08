import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";

import config from "./config";
import routerChat from './api/chat/router'
import routerMessage from './api/message/router'
import routerSign from './api/sign/router'

const app: Application = express();
const PORT: number = config.PORT;
const URL: string = config.URL;

app.use(cors());
app.use(express.json());

app.use('/api/chat', routerChat);
app.use('/api/message', routerMessage);
app.use('/api/sign', routerSign);

const start = async (): Promise<void> => {
    try {
        await mongoose.connect(URL);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();