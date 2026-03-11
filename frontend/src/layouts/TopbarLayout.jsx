import { PiMagnifyingGlassLight, PiSignOutLight } from "react-icons/pi";

const TopbarLayout = () => {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <label className="relative block w-full max-w-125">
        <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#A9A9A9]" />
        <input
          type="text"
          placeholder="Enter the keyword here..."
          className="h-10 w-full rounded-xl border border-[#D7D7D7] bg-transparent pl-10 pr-4 text-sm text-[#5F5F5F] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] focus:bg-white"
        />
      </label>

      <div className="ml-6 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/images/UserImage.png"
            alt="User profile"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="min-w-max">
            <p className="text-base font-medium text-[#202020]">John Doe</p>
            <p className="text-sm text-[#9C9C9C]">Admin</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF3B30] transition hover:bg-[#FFF0EF]"
        >
          <PiSignOutLight className="text-[24px]" />
        </button>
      </div>
    </header>
  );
};

export default TopbarLayout;
