"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const router_1 = __importDefault(require("./api/chat/router"));
const router_2 = __importDefault(require("./api/message/router"));
const router_3 = __importDefault(require("./api/sign/router"));
const app = express_1.default();
const PORT = config_1.default.PORT;
const URL = config_1.default.URL;
app.use(cors_1.default());
app.use(express_1.default.json());
app.use('/api/chat', router_1.default);
app.use('/api/message', router_2.default);
app.use('/api/sign', router_3.default);
const start = async () => {
    try {
        await mongoose_1.default.connect(URL);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
