import { number, object, string } from "joi";

/* 구조 정의 */ 
export const createSample = object().keys({
    text: string().required(),
    email: string().required(),
});

export const updateSample = object().keys({
    id: number().required(),
    text: string().required(),
});

export const deleteSample = object().keys({
    id: number().required(),
});
