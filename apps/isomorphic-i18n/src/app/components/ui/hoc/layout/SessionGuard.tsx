'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
	children: React.ReactNode;
};

const SessionGuard = ({ children }: Props) => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('Token');
		if (!token) {
			router.push('/');
			// setLoading(false);
		} else {
			setLoading(false);
		}
	}, [router]);

	if (loading) {
		return null;
	}

	return <>{children}</>;
};

export default SessionGuard;
