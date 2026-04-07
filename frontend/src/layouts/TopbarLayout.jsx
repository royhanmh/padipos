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
    <header className="flex items-center justify-between gap-4 bg-white px-5 py-3 md:px-6 md:py-4">
      {showSearch ? (
        <label className="relative block w-full max-w-[560px] md:max-w-[620px]">
          <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#A9A9A9] md:text-[22px]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-[10px] border border-[#D7D7D7] bg-transparent pl-10 pr-5 text-[14px] text-[#5F5F5F] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] focus:bg-white md:h-11 md:pl-11 md:text-[15px]"
            {...inputProps}
          />
        </label>
      ) : (
        <div className="flex-1" />
      )}

      <div className="ml-5 flex items-center gap-3 md:ml-6 md:gap-4">
        {beforeProfile}

        <div className="flex items-center gap-3">
          <img
            src={profile.image ?? defaultProfile.image}
            alt="User profile"
            className="h-10 w-10 rounded-full object-cover md:h-11 md:w-11"
          />
          <div className="hidden min-w-max md:block">
            <p className="text-[14px] font-medium text-[#202020] md:text-[15px]">
              {profile.name ?? defaultProfile.name}
            </p>
            <p className="text-[12px] text-[#9C9C9C] md:text-[13px]">
              {profile.role ?? defaultProfile.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Sign out"
          onClick={onSignOut}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF3333] transition hover:bg-[#FFF0EF] md:h-11 md:w-11"
        >
          <PiSignOutLight className="text-[24px] md:text-[26px]" />
        </button>
      </div>
    </header>
  );
};

export default TopbarLayout;
