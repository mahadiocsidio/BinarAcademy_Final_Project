const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    restrict: async (req, res, next) => {
        // const authorization = req.query.token;
        const authorization = req.headers.authorization;
        if (!authorization) {
          return res.status(401).json({
            status: false,
            message: "Unauthorized",
            error: "Token not found",
          });
        }

        jwt.verify(authorization, JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized',
                    err: err.message,
                    data: null
                });
            }

            req.user = await prisma.account.findUnique({
                where: {email: decoded.email}
              });
            next();
        });
    }
};