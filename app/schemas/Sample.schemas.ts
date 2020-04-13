import { number, object, string } from "joi";

/* 구조 정의 */ 
export const createSample = object().keys({
    text: string().required(),
    email: string().required(),
    name: string().required(),
    age: number().required(),
    phone: string().required(),
});

export const updateSample = object().keys({
    id: number().required(),
    text: string().required(),
    email: string().required(),
    name: string().required(),
    age: number().required(),
    phone: string().required(),
});

export const deleteSample = object().keys({
    id: number().required(),
});

export const tokendeleteSample = object().keys({
    token2: string().required(),
});