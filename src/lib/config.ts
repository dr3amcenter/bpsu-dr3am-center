import type { ComponentType } from "svelte";
import type { Icon } from "lucide-svelte";

import {
	LayoutDashboardIcon,
	UserRoundIcon,
	WarehouseIcon,
	TriangleAlertIcon,
	Settings2Icon,
	ScrollTextIcon
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
		{ href: "/admin/request", label: "Request", icon: ScrollTextIcon },
		{ href: "/admin/transaction-report", label: "Transaction Report", icon: TriangleAlertIcon },

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
		{
			href: "/admin/settings",
			label: "Setting",
			icon: Settings2Icon,
			sublinks: [
				{ href: "/admin/settings/categories", label: "Category", icon: UserRoundIcon },
				{ href: "/admin/settings/locations", label: "Location", icon: UserRoundIcon },
				{ href: "/admin/settings/brands", label: "Brand", icon: UserRoundIcon },
				{ href: "/admin/settings/classifications", label: "Classification", icon: UserRoundIcon }
			]
		}
	],
	user: [{ href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboardIcon }]
};

export const availabilities = [
	"Available",
	"Not Available",
	"Out of Stocks",
	"For Repair"
] as const;

export const consumabilities = ["Consumable", "Not Consumable"];
