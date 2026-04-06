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
    <header className="flex items-center justify-between gap-5 bg-white px-5 py-4 md:px-7 md:py-5">
      {showSearch ? (
        <label className="relative block w-full max-w-[560px] md:max-w-[620px]">
          <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A9A9A9] md:text-[24px]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#D7D7D7] bg-transparent pl-11 pr-5 text-base text-[#5F5F5F] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] focus:bg-white md:h-12 md:pl-12"
            {...inputProps}
          />
        </label>
      ) : (
        <div className="flex-1" />
      )}

      <div className="ml-6 flex items-center gap-4 md:ml-8 md:gap-5">
        {beforeProfile}

        <div className="flex items-center gap-4">
          <img
            src={profile.image ?? defaultProfile.image}
            alt="User profile"
            className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
          />
          <div className="min-w-max">
            <p className="text-base font-medium text-[#202020] md:text-lg">
              {profile.name ?? defaultProfile.name}
            </p>
            <p className="text-sm text-[#9C9C9C] md:text-base">
              {profile.role ?? defaultProfile.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Sign out"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[#FF3333] transition hover:bg-[#FFF0EF] md:h-12 md:w-12"
        >
          <PiSignOutLight className="text-[26px] md:text-[28px]" />
        </button>
      </div>
    </header>
  );
};

export default TopbarLayout;

