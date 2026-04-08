import { PiMagnifyingGlassLight, PiSignOutLight } from "react-icons/pi";

const defaultProfile = {
  name: "John Doe",
  role: "Admin",
  image: "/images/UserImage.png",
};

const TopbarLayout = ({
  searchValue = "",
  searchPlaceholder = "Enter the keyword here...",
  onSearchChange,
  onSignOut,
  profile = defaultProfile,
  showSearch = true,
  beforeProfile = null,
}) => {
  const inputProps = onSearchChange
    ? {
        value: searchValue,
        onChange: (event) => onSearchChange(event.target.value),
      }
    : {
        defaultValue: searchValue,
      };

  return (
    <header className="bg-white px-6 py-4 max-lg:px-4 max-lg:py-3 lg:border-b lg:border-[#EEF2F8]">
      <div className="flex items-center justify-between gap-4 max-lg:gap-3">
        <img
          src="/images/PrimaryRoundIcon.png"
          alt="Primary logo"
          loading="lazy"
          className="hidden h-10 w-10 rounded-full object-cover shadow-[0_10px_22px_rgba(83,100,232,0.24)] max-lg:block"
        />

        {showSearch ? (
          <label className="relative block w-full max-w-[620px] max-lg:hidden">
            <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A9A9A9]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-[10px] border border-[#D7D7D7] bg-transparent pl-11 pr-5 text-[15px] text-[#5F5F5F] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] focus:bg-white"
              {...inputProps}
            />
          </label>
        ) : (
          <div className="flex-1 max-lg:hidden" />
        )}

        <div className="flex items-center gap-2 lg:ml-6 lg:gap-4">
          {beforeProfile}

          <div className="flex items-center gap-3">
            <img
              src={profile.image ?? defaultProfile.image}
              alt="User profile"
              loading="lazy"
              className="h-11 w-11 rounded-full object-cover max-lg:h-10 max-lg:w-10"
            />
            <div className="min-w-max max-lg:hidden">
              <p className="text-[15px] font-medium text-[#202020]">
                {profile.name ?? defaultProfile.name}
              </p>
              <p className="text-[13px] text-[#9C9C9C]">
                {profile.role ?? defaultProfile.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Sign out"
            onClick={onSignOut}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#FF3333] transition hover:bg-[#FFF0EF] max-lg:h-10 max-lg:w-10"
          >
            <PiSignOutLight className="text-[26px] max-lg:text-[24px]" />
          </button>
        </div>
      </div>

      {showSearch ? (
        <label className="relative mt-3 block w-full lg:hidden">
          <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#A9A9A9]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-[10px] border border-[#D7D7D7] bg-transparent pl-10 pr-4 text-[14px] text-[#5F5F5F] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] focus:bg-white"
            {...inputProps}
          />
        </label>
      ) : null}
    </header>
  );
};

export default TopbarLayout;
