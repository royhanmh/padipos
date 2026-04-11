import { createElement } from "react";
import { Link } from "react-router";
import {
  PiArrowCircleRightLight,
  PiBowlFoodLight,
  PiGearSixLight,
  PiGridFourLight,
  PiReceiptLight,
} from "react-icons/pi";

const defaultItems = [
  {
    id: "dashboard",
    icon: PiGridFourLight,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "catalog",
    icon: PiBowlFoodLight,
    label: "Catalog",
    href: "/dashboard/catalog",
  },
  {
    id: "orders",
    icon: PiReceiptLight,
    label: "Orders",
    href: "/dashboard/sales-report",
  },

  {
    id: "settings",
    icon: PiGearSixLight,
    label: "Settings",
    href: "/dashboard/settings",
  },
];

const desktopItemClassName = (isActive, variant) => {
  if (variant === "kasir") {
    return `flex h-10 w-10 items-center justify-center rounded-[10px] transition ${
      isActive ? "text-[#3572EF]" : "text-[#C2C2C2] hover:text-[#A1A1A1]"
    }`;
  }

  return `flex h-10 w-10 items-center justify-center rounded-[10px] transition ${
    isActive
      ? "text-[#3572EF]"
      : "text-[#B9C8EA] hover:bg-white hover:text-[#6392F3]"
  }`;
};

const mobileItemClassName = (isActive) =>
  `flex min-h-12 flex-col items-center justify-center gap-1 rounded-[10px] px-2 text-[12px] font-medium transition ${
    isActive
      ? "bg-[#EEF4FF] text-[#3572EF]"
      : "text-[#9CA3AF] hover:bg-[#F6F8FC] hover:text-[#5E5E5E]"
  }`;

const mobileLabelMap = {
  dashboard: "Home",
  catalog: "Menu",
  orders: "Orders",
  settings: "Settings",
};

const SidebarLayout = ({
  activeItem = "dashboard",
  items = defaultItems,
  variant = "dashboard",
}) => {
  return (
    <>
      <aside className="row-span-2 hidden min-h-0 flex-col items-center border-r border-[#EEF2F8] bg-white px-4 py-5 lg:flex">
        <div className="flex w-full justify-center border-b-2 border-[#F7F7F7] pb-4">
          <img
            src="/images/PrimaryRoundIcon.png"
            alt="Primary logo"
            className="h-12 w-12 rounded-full object-cover shadow-[0_14px_28px_rgba(83,100,232,0.28)]"
          />
        </div>
        <div className="flex w-full justify-center border-b-2 border-[#F7F7F7] py-4">
          <PiArrowCircleRightLight className="text-[32px] text-[#3572EF]" />
        </div>

        <nav className="mt-6 flex flex-1 flex-col items-center justify-between">
          <ul className="flex w-full flex-col items-center gap-4">
            {items.map(({ id, icon, label, href }) => {
              const isActive = id === activeItem;
              const sharedProps = {
                "aria-label": label,
                className: desktopItemClassName(isActive, variant),
              };

              return (
                <li key={label} className="relative flex w-full justify-center">
                  {href ? (
                    <Link to={href} {...sharedProps}>
                      {icon
                        ? createElement(icon, { className: "text-[26px]" })
                        : null}
                    </Link>
                  ) : (
                    <button type="button" {...sharedProps}>
                      {icon
                        ? createElement(icon, { className: "text-[26px]" })
                        : null}
                    </button>
                  )}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-[27.5px] top-1/2 h-9 w-1 -translate-y-1/2 rounded-l-full bg-[#3572EF]"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EEF2F8] bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(17,24,39,0.08)] lg:hidden">
        <ul
          className="mx-auto grid max-w-2xl gap-2"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map(({ id, icon, label, href }) => {
            const isActive = id === activeItem;
            const mobileLabel = mobileLabelMap[id] ?? label;
            const sharedProps = {
              "aria-label": label,
              className: mobileItemClassName(isActive),
            };

            return (
              <li key={`mobile-${label}`}>
                {href ? (
                  <Link to={href} {...sharedProps}>
                    {icon
                      ? createElement(icon, { className: "text-[20px]" })
                      : null}
                    <span className="max-w-full truncate leading-none">
                      {mobileLabel}
                    </span>
                  </Link>
                ) : (
                  <button type="button" {...sharedProps}>
                    {icon
                      ? createElement(icon, { className: "text-[20px]" })
                      : null}
                    <span className="max-w-full truncate leading-none">
                      {mobileLabel}
                    </span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default SidebarLayout;
