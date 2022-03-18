import { Express } from "express";
import { HttpRoute } from "../types/routes";

export function createRoutes(app: Express): void {
	const routes: HttpRoute[] = [];

	routes.forEach(route => {
		app[route.method](route.path, ...route.handlers);
	});
}
