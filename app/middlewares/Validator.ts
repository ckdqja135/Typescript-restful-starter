/* Joi를 사용하여 Express 애플리케이션의 입력을 검증한다. */
import * as express from "express";
import { ObjectSchema, ValidationOptions } from "joi";

const OPTS: ValidationOptions = {
    abortEarly: false,
    language: {
        key: "{{key}} ",
    },
};

export function Validator(schema: ObjectSchema) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const params = req.method === "GET" ? req.params : req.body; // req.method가 GET방식일 경우.
        const { error } = schema.validate(params, OPTS);
        if (error) {
            const { message } = error;
            return res.status(400).json({ message });
        } else {
            return next();
        }
    };
}
