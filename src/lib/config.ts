import type { ComponentType } from "svelte";
import type { Icon } from "lucide-svelte";

import {
	LayoutDashboardIcon,
	UserRoundIcon,
	WarehouseIcon,
	TriangleAlertIcon
} from "lucide-svelte";

export type BaseLink = {
	href: `/${string}`;
	icon: ComponentType<Icon>;
	label: string;
};

export const links: Record<
	"admin" | "user",
	(BaseLink & {
		sublinks?: BaseLink[];
	})[]
> = {
	admin: [
		{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
		{ href: "/admin/inventory", label: "Inventory", icon: WarehouseIcon },
		{
			href: "/admin/accounts",
			label: "Account",
			icon: UserRoundIcon,
			sublinks: [
				{ href: "/admin/accounts/admins", label: "Admin", icon: UserRoundIcon },
				{ href: "/admin/accounts/users", label: "User", icon: UserRoundIcon },
				{ href: "/admin/accounts/deleted-account", label: "Deleted Account", icon: UserRoundIcon }
			]
		},

		{ href: "/admin/report", label: "Report", icon: TriangleAlertIcon }
	],
	user: [{ href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboardIcon }]
};

export const availabilities: string[] = [
	"Available",
	"Not Available",
	"Out of Stocks",
	"For Repair"
];

export const consumabilities = ["Consumable", "Not Consumable"];
