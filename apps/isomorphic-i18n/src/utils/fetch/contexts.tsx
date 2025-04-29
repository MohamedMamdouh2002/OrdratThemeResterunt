'use client';
import React, { createContext, useState } from 'react';

export const HeaderContext = createContext<{
	currentSection: {
		title: string;
		section: string;
	};
	setCurrentSection: (val: { title: string; section: string }) => void;
	selectedByUser: boolean;
	setSelectedByUser: (val: boolean) => void;
}>({
	currentSection: {
		title: '',
		section: ''
	},
	setCurrentSection: () => null,
	selectedByUser: false,
	setSelectedByUser: () => null
});

export const CartContext = createContext<{ cart: any[]; setCart: (val: any[]) => void }>({
	cart: [],
	setCart: () => null
});

export const SessionContext = createContext<{
	session: Partial<Session>;
	setSession: (val: Partial<Session>) => void;
}>({
	session: {},
	setSession: () => null
});

export function HeaderContextProvider({ children }: { children: React.ReactNode }) {
	const [currentSection, setCurrentSection] = useState({
		title: 'Order Again',
		section: '#order-again'
	});
	const [selectedByUser, setSelectedByUser] = useState(false);
	return (
		<HeaderContext.Provider
			value={{ currentSection, setCurrentSection, selectedByUser, setSelectedByUser }}
		>
			{children}
		</HeaderContext.Provider>
	);
}

export function CartContextProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<any[]>([]);

	return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Partial<Session>>({});

	return (
		<SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>
	);
}
