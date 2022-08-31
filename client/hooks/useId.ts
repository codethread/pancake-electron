import { useState } from 'react';

function n() {
	return (Math.random() * 10000000).toFixed(0);
}

export const useId = (): string => useState(() => n())[0];
