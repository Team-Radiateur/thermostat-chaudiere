import { RequestHandler } from "express";

export type HttpMethod = "get" | "post" | "delete" | "put" | "patch";
export type HttpRoute = {
	method: HttpMethod;
	path: string;
	handlers: RequestHandler[];
};
