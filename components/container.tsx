import { cn } from "cn";
import type React from "react";

export function Container({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("flex w-full max-w-7xl px-4 md:px-6 py-10", className)}>
			{children}
		</section>
	);
}