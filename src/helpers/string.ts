const normalized = (message: string) => {
	return message.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const string = {
	normalized
};
