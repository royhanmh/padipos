import { createElement } from "react";
import { Link } from "react-router";
import {
  PiArrowCircleRightLight,
  PiBowlFoodLight,
  PiFileLight,
  PiGearSixLight,
  PiGridFourLight,
  PiReceiptLight,
} from "react-icons/pi";

const defaultItems = [
  { id: "dashboard", icon: PiGridFourLight, label: "Dashboard", href: "/dashboard" },
  { id: "catalog", icon: PiBowlFoodLight, label: "Catalog", href: "/dashboard/catalog" },
  { id: "orders", icon: PiReceiptLight, label: "Orders" },
  { id: "files", icon: PiFileLight, label: "Files" },
  { id: "settings", icon: PiGearSixLight, label: "Settings" },
];

const itemClassName = (isActive) =>
  `flex h-10 w-10 items-center justify-center rounded-2xl transition ${
    isActive
      ? "text-[#4D7CFE]"
      : "text-[#B9C8EA] hover:bg-white hover:text-[#7EA4FF]"
  }`;

const SidebarLayout = ({ activeItem = "dashboard", items = defaultItems }) => {
  return (
    <aside className="row-span-2 flex min-h-screen flex-col items-center border-r border-[#EEF2F8] bg-white px-4 py-5">
      <div className="flex w-full justify-center border-b-2 border-[#F7F7F7] pb-4">
        <img
          src="/images/PrimaryRoundIcon.png"
          alt="Primary logo"
          className="h-12 w-12 rounded-full object-cover shadow-[0_14px_28px_rgba(83,100,232,0.28)]"
        />
      </div>
      <div className="flex w-full justify-center border-b-2 border-[#F7F7F7] py-4">
        <PiArrowCircleRightLight className="text-[32px] text-[#4D7CFE]" />
      </div>

      <nav className="mt-6 flex flex-1 flex-col items-center justify-between">
        <ul className="flex w-full flex-col items-center gap-4">
          {items.map(({ id, icon, label, href }) => {
            const isActive = id === activeItem;
            const sharedProps = {
              "aria-label": label,
              className: itemClassName(isActive),
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
                    className="absolute -right-6 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-[#4D7CFE]"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarLayout;
