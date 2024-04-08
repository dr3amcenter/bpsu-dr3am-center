import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { isWithinInterval, isAfter, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function checkExpiration(dateToCheck: Date) {
	const currentDate = new Date();

	const isExpired = isAfter(dateToCheck, currentDate);
	const isExpiredWithin30Days = isWithinInterval(dateToCheck, {
		start: currentDate,
		end: subDays(currentDate, 30)
	});
	const isExpiredWithin6Months = isWithinInterval(dateToCheck, {
		start: currentDate,
		end: subDays(currentDate, 180)
	});

	return {
		isExpired: isExpired,
		isExpiredWithin30Days: isExpiredWithin30Days,
		isExpiredWithin6Months: isExpiredWithin6Months
	};
}

export function getFrequency(months: number) {
	if (months === 1) {
		return "monthly";
	} else if (months % 12 === 0) {
		const years = months / 12;
		if (years === 1) {
			return "yearly";
		} else {
			return `every ${years} years`;
		}
	} else if (months % 6 === 0) {
		const halfYears = months / 6;
		if (halfYears === 1) {
			return "twice a year";
		} else {
			return `every ${halfYears} months`;
		}
	} else {
		return `every ${months} months`;
	}
}

type GroupedObject<T> = {
	[key: string]: T[];
};

export function groupBy<T>(array: T[], getKey: (item: T) => string): GroupedObject<T> {
	return array.reduce((acc: GroupedObject<T>, item: T) => {
		const key = getKey(item);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(item);
		return acc;
	}, {});
}
