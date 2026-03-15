const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env.config');

const rateLimiter = require('./middlewares/rateLimit.middleware');
const errorHandler = require('./middlewares/error.middleware');

const v1Routes = require('./routes/v1');
const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));


app.use(rateLimiter);
app.use('/api/v1', v1Routes);

app.use(errorHandler);
module.exports = app;
