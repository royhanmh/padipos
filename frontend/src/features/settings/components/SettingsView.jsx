import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiCaretDownLight,
  PiEyeClosedLight,
  PiLockLight,
  PiXLight,
} from "react-icons/pi";
import { useShallow } from "zustand/react/shallow";
import AlertBannerComponent from "../../../components/AlertBannerComponent";
import ConfirmationModalComponent from "../../../components/ConfirmationModalComponent";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuthStore } from "../../../stores/authStore";

const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "indonesian", label: "Indonesian" },
];

const MODE_OPTIONS = [
  { value: "light", label: "Light Mode" },
  { value: "dark", label: "Dark Mode" },
];

const FONT_SIZE_OPTIONS = [
  { value: "14", label: "14 px" },
  { value: "16", label: "16 px" },
  { value: "18", label: "18 px" },
];

const ZOOM_OPTIONS = [
  { value: "90", label: "90 (Compact)" },
  { value: "100", label: "100 (Normal)" },
  { value: "110", label: "110 (Comfort)" },
  { value: "125", label: "125 (Large)" },
];

const allowedImageTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const DEFAULT_AVATAR = "/images/UserImage.png";

const createDefaultSettings = (accountDefaults = {}) => ({
  account: {
    email: accountDefaults.email ?? "johndoe@gmail.com",
    username: accountDefaults.username ?? "John Doe",
    role: accountDefaults.role ?? "Admin",
    status: accountDefaults.status ?? "Active",
    language: accountDefaults.language ?? "english",
    avatar: accountDefaults.avatar ?? DEFAULT_AVATAR,
  },
  appearance: {
    mode: "light",
    fontSize: "16",
    zoom: "100",
  },
  security: {
    passwordChangedAt: null,
  },
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to load selected image."));
    reader.readAsDataURL(file);
  });

const createComparableSnapshot = (value) =>
  JSON.stringify({
    account: {
      email: value.account.email,
      username: value.account.username,
      avatar: value.account.avatar,
    },
  });

const isCloudinaryAvatar = (value) =>
  typeof value === "string" &&
  value.startsWith("http") &&
  value.includes("cloudinary.com");

const formatPasswordChangedAt = (value) => {
  if (!value) {
    return "Not changed yet";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not changed yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const SettingsView = ({
  layoutSidebarProps,
  layoutTopbarProps,
  pageTitle = "Settings",
  accountDefaults,
}) => {
  const { updateCurrentUserProfile, updateCurrentUserPassword } = useAuthStore(
    useShallow((state) => ({
      updateCurrentUserProfile: state.updateCurrentUserProfile,
      updateCurrentUserPassword: state.updateCurrentUserPassword,
    })),
  );

  const initialSettings = useMemo(
    () => createDefaultSettings(accountDefaults),
    [
      accountDefaults?.email,
      accountDefaults?.username,
      accountDefaults?.role,
      accountDefaults?.status,
      accountDefaults?.language,
      accountDefaults?.avatar,
    ],
  );

  const [formSettings, setFormSettings] = useState(() =>
    createDefaultSettings(accountDefaults),
  );
  const [committedSettings, setCommittedSettings] = useState(() =>
    createDefaultSettings(accountDefaults),
  );
  const [toastMessage, setToastMessage] = useState("");
  const [accountError, setAccountError] = useState("");
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeletingPicture, setIsDeletingPicture] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSubmitError, setPasswordSubmitError] = useState("");
  const [pendingPasswordUpdate, setPendingPasswordUpdate] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (!isPasswordModalOpen || isPasswordConfirmOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsPasswordModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isPasswordConfirmOpen, isPasswordModalOpen]);

  useEffect(() => {
    if (!isSaveConfirmOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSaveConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSaveConfirmOpen]);

  useEffect(() => {
    if (!isDeleteConfirmOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDeleteConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDeleteConfirmOpen]);

  useEffect(() => {
    if (!isPasswordConfirmOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsPasswordConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isPasswordConfirmOpen]);

  useEffect(() => {
    setFormSettings((currentValue) => ({
      ...currentValue,
      account: initialSettings.account,
    }));
    setCommittedSettings((currentValue) => ({
      ...currentValue,
      account: initialSettings.account,
    }));
    setAccountError("");
    setAvatarError("");
  }, [initialSettings.account]);

  const isDirty = useMemo(() => {
    return (
      createComparableSnapshot(formSettings) !==
      createComparableSnapshot(committedSettings)
    );
  }, [committedSettings, formSettings]);

  const updateAccountField = (field, value) => {
    setAccountError("");
    setFormSettings((currentValue) => ({
      ...currentValue,
      account: {
        ...currentValue.account,
        [field]: value,
      },
    }));
  };

  const updateAppearanceField = (field, value) => {
    setFormSettings((currentValue) => ({
      ...currentValue,
      appearance: {
        ...currentValue.appearance,
        [field]: value,
      },
    }));
  };

  const handleChangePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!allowedImageTypes.has(file.type)) {
      setAvatarError("Please use PNG, JPG, JPEG, or WEBP image format.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setAvatarError("Image must be 5MB or smaller.");
      return;
    }

    try {
      const nextImage = await readFileAsDataUrl(file);
      updateAccountField("avatar", nextImage);
      setAvatarError("");
      setAccountError("");
    } catch {
      setAvatarError("Selected image could not be loaded.");
    }
  };

  const openDeleteConfirmModal = () => {
    if (isSavingAccount || isDeletingPicture) {
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmOpen(false);
  };

  const performDeletePicture = () => {
    if (isSavingAccount || isDeletingPicture) {
      return;
    }

    const currentAvatar = formSettings.account.avatar;

    if (!isCloudinaryAvatar(currentAvatar)) {
      updateAccountField("avatar", committedSettings.account.avatar || DEFAULT_AVATAR);
      setAvatarError("");
      setAccountError("");
      return;
    }

    setIsDeletingPicture(true);
    setAvatarError("");
    setAccountError("");

    updateCurrentUserProfile({ image_profile: null })
      .then((updatedUser) => {
        const nextAvatar = updatedUser.image_profile || DEFAULT_AVATAR;

        setFormSettings((currentValue) => ({
          ...currentValue,
          account: {
            ...currentValue.account,
            avatar: nextAvatar,
          },
        }));
        setCommittedSettings((currentValue) => ({
          ...currentValue,
          account: {
            ...currentValue.account,
            avatar: nextAvatar,
          },
        }));
      })
      .catch((error) => {
        setAvatarError(
          error?.details?.[0] || error?.message || "Failed to delete picture.",
        );
      })
      .finally(() => {
        setIsDeletingPicture(false);
      });
  };

  const confirmDeletePicture = () => {
    closeDeleteConfirmModal();
    performDeletePicture();
  };

  const openSaveConfirmModal = () => {
    if (!isDirty || isSavingAccount) {
      return;
    }

    setIsSaveConfirmOpen(true);
  };

  const closeSaveConfirmModal = () => {
    setIsSaveConfirmOpen(false);
  };

  const confirmSaveChanges = async () => {
    if (!isDirty || isSavingAccount) {
      return;
    }

    closeSaveConfirmModal();
    await handleSaveChanges();
  };

  const handleSaveChanges = async () => {
    if (!isDirty || isSavingAccount) {
      return;
    }

    setIsSavingAccount(true);
    setAccountError("");

    try {
      const updatedUser = await updateCurrentUserProfile({
        username: formSettings.account.username.trim(),
        email: formSettings.account.email.trim(),
        image_profile:
          formSettings.account.avatar &&
          formSettings.account.avatar !== DEFAULT_AVATAR
            ? formSettings.account.avatar
            : null,
      });

      const nextAccount = {
        ...formSettings.account,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role === "cashier" ? "Cashier" : "Admin",
        status: updatedUser.status === "nonactive" ? "Inactive" : "Active",
        avatar: updatedUser.image_profile || DEFAULT_AVATAR,
      };

      setFormSettings((currentValue) => ({
        ...currentValue,
        account: nextAccount,
      }));
      setCommittedSettings((currentValue) => ({
        ...currentValue,
        account: nextAccount,
      }));
      setToastMessage("Saved successfully.");
    } catch (error) {
      const firstDetail = error?.details?.[0];
      setAccountError(
        firstDetail || error?.message || "Failed to save settings.",
      );
    } finally {
      setIsSavingAccount(false);
    }
  };

  const openPasswordModal = () => {
    setPasswordErrors({});
    setPasswordSubmitError("");
    setPendingPasswordUpdate(null);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordErrors({});
    setPasswordSubmitError("");
    setIsPasswordConfirmOpen(false);
    setPendingPasswordUpdate(null);
  };

  const updatePasswordField = (field, value) => {
    setPasswordForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
    setPasswordErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
    setPasswordSubmitError("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!passwordForm.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required.";
    }

    if (!passwordForm.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (!strongPasswordPattern.test(passwordForm.newPassword)) {
      nextErrors.newPassword =
        "Use at least 8 characters with letters and numbers.";
    }

    if (!passwordForm.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      nextErrors.confirmPassword = "Password confirmation does not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      return;
    }

    setPendingPasswordUpdate({
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
    });
    setIsPasswordConfirmOpen(true);
  };

  const closePasswordConfirmModal = () => {
    setIsPasswordConfirmOpen(false);
    setPendingPasswordUpdate(null);
  };

  const confirmPasswordChange = async () => {
    if (!pendingPasswordUpdate || isSavingPassword) {
      return;
    }

    setIsSavingPassword(true);
    setPasswordSubmitError("");

    try {
      await updateCurrentUserPassword(pendingPasswordUpdate);

      const nextPasswordChangedAt = new Date().toISOString();
      setFormSettings((currentValue) => ({
        ...currentValue,
        security: {
          ...currentValue.security,
          passwordChangedAt: nextPasswordChangedAt,
        },
      }));
      setCommittedSettings((currentValue) => ({
        ...currentValue,
        security: {
          ...currentValue.security,
          passwordChangedAt: nextPasswordChangedAt,
        },
      }));
      closePasswordConfirmModal();
      closePasswordModal();
      setToastMessage("Password changed successfully.");
    } catch (error) {
      closePasswordConfirmModal();
      if (error?.status === 401) {
        setPasswordErrors({
          currentPassword: error.message || "Current password is invalid.",
        });
      } else if (error?.details?.length > 0) {
        setPasswordSubmitError(error.details[0]);
      } else {
        setPasswordSubmitError(error?.message || "Failed to update password.");
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <DashboardLayout
      sidebarProps={layoutSidebarProps}
      topbarProps={layoutTopbarProps}
    >
      <section className="min-h-full bg-[#F7F7F7] px-6 py-6 max-lg:px-4 max-lg:py-4 xl:px-8 xl:py-7">
        <div className="mx-auto w-full max-w-[1280px]">
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-[#1D1D1D] max-lg:text-[30px]">
            {pageTitle}
          </h1>

          {toastMessage ? (
            <AlertBannerComponent
              message={toastMessage}
              onDismiss={() => setToastMessage("")}
              className="mt-4"
            />
          ) : null}

          <section className="mt-6">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#353535]">
              Account
            </h2>

            <div className="mt-4 flex items-center gap-4 max-lg:flex-col max-lg:items-start">
              <img
                src={formSettings.account.avatar}
                alt="Account avatar"
                className="h-18 w-18 rounded-full object-cover"
              />
              <div className="flex flex-wrap gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handlePictureFileChange}
                />
                <button
                  type="button"
                  onClick={handleChangePictureClick}
                  className="h-12 rounded-[10px] bg-[#3572EF] px-5 text-base font-medium text-white transition hover:brightness-105 md:h-13"
                >
                  Change Picture
                </button>
                <button
                  type="button"
                  onClick={openDeleteConfirmModal}
                  disabled={isSavingAccount || isDeletingPicture}
                  className="h-12 rounded-[10px] border border-[#3572EF] bg-white px-5 text-base font-medium text-[#3572EF] transition hover:bg-[#F2F6FF] md:h-13"
                >
                  {isDeletingPicture ? "Deleting..." : "Delete Picture"}
                </button>
              </div>
            </div>
            {avatarError ? (
              <AlertBannerComponent
                variant="error"
                message={avatarError}
                className="mt-2"
              />
            ) : null}
            {accountError ? (
              <AlertBannerComponent
                variant="error"
                message={accountError}
                className="mt-2"
              />
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-4 max-lg:grid-cols-1 xl:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Email
                </span>
                <input
                  type="email"
                  value={formSettings.account.email}
                  onChange={(event) =>
                    updateAccountField("email", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#CFCFCF] bg-white px-4 text-base text-[#404040] outline-none transition focus:border-[#C2D4FA] md:h-13"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Username
                </span>
                <input
                  type="text"
                  value={formSettings.account.username}
                  onChange={(event) =>
                    updateAccountField("username", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#CFCFCF] bg-white px-4 text-base text-[#404040] outline-none transition focus:border-[#C2D4FA] md:h-13"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Role
                </span>
                <input
                  type="text"
                  value={formSettings.account.role}
                  readOnly
                  className="h-12 w-full rounded-xl border border-[#CFCFCF] bg-[#F8F8F8] px-4 text-base text-[#4F4F4F] md:h-13"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Status
                </span>
                <input
                  type="text"
                  value={formSettings.account.status}
                  readOnly
                  className="h-12 w-full rounded-xl border border-[#CFCFCF] bg-[#F8F8F8] px-4 text-base text-[#4F4F4F] md:h-13"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Language
                </span>
                <div className="relative">
                  <select
                    value={formSettings.account.language}
                    onChange={(event) =>
                      updateAccountField("language", event.target.value)
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-[#CFCFCF] bg-white px-4 pr-10 text-base text-[#404040] outline-none transition focus:border-[#C2D4FA] md:h-13"
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A5A5A5]" />
                </div>
              </label>
            </div>
          </section>

          <div className="mt-6 border-t border-[#E7E7E7]" />

          <section className="mt-6">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#353535]">
              Password
            </h2>

            <div className="mt-4 max-w-160">
              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Password
                </span>
                <div className="relative">
                  <input
                    type="password"
                    value="********"
                    readOnly
                    className="h-12 w-full rounded-xl border border-[#CFCFCF] bg-white px-4 pr-11 text-base text-[#404040] md:h-13"
                  />
                  <PiEyeClosedLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A5A5A5]" />
                </div>
              </label>
              <button
                type="button"
                onClick={openPasswordModal}
                className="mt-4 h-12 rounded-[10px] bg-[#3572EF] px-5 text-base font-medium text-white transition hover:brightness-105 md:h-13"
              >
                Change Password
              </button>
              <p className="mt-2 text-sm text-[#8A8A8A]">
                Last changed:{" "}
                {formatPasswordChangedAt(
                  formSettings.security.passwordChangedAt,
                )}
              </p>
            </div>
          </section>

          <div className="mt-6 border-t border-[#E7E7E7]" />

          <section className="mt-6">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#353535]">
              Appearance
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-4 max-lg:grid-cols-1 xl:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Preference Mode
                </span>
                <div className="relative">
                  <select
                    value={formSettings.appearance.mode}
                    onChange={(event) =>
                      updateAppearanceField("mode", event.target.value)
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-[#CFCFCF] bg-white px-4 pr-10 text-base text-[#404040] outline-none transition focus:border-[#C2D4FA] md:h-13"
                  >
                    {MODE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A5A5A5]" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Font Size
                </span>
                <div className="relative">
                  <select
                    value={formSettings.appearance.fontSize}
                    onChange={(event) =>
                      updateAppearanceField("fontSize", event.target.value)
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-[#CFCFCF] bg-white px-4 pr-10 text-base text-[#404040] outline-none transition focus:border-[#C2D4FA] md:h-13"
                  >
                    {FONT_SIZE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A5A5A5]" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-base text-[#636363]">
                  Zoom Display
                </span>
                <div className="relative">
                  <select
                    value={formSettings.appearance.zoom}
                    onChange={(event) =>
                      updateAppearanceField("zoom", event.target.value)
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-[#CFCFCF] bg-white px-4 pr-10 text-base text-[#404040] outline-none transition focus:border-[#C2D4FA] md:h-13"
                  >
                    {ZOOM_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A5A5A5]" />
                </div>
              </label>
            </div>
          </section>

          <div className="mt-6 border-t border-[#E7E7E7]" />

          <div className="mt-6">
            <button
              type="button"
              onClick={openSaveConfirmModal}
              disabled={!isDirty || isSavingAccount}
              className={`h-12 rounded-[10px] px-6 text-base font-medium transition md:h-13 ${
                isDirty && !isSavingAccount
                  ? "bg-[#3572EF] text-white shadow-[0_10px_24px_rgba(53,114,239,0.24)] hover:brightness-105"
                  : "cursor-not-allowed bg-[#C7C7C7] text-[#EFEFEF]"
              }`}
            >
              {isSavingAccount ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </section>

      {isPasswordModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={closePasswordModal}
        >
          <div
            className="w-full max-w-[560px] rounded-[20px] bg-white p-6 shadow-[0_22px_60px_rgba(17,24,39,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1FF] text-[#3572EF]">
                  <PiLockLight className="text-[20px]" />
                </span>
                <h3 className="text-[26px] font-semibold text-[#1F1F1F]">
                  Change Password
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close password modal"
                onClick={closePasswordModal}
                className="text-[#666666] transition hover:text-[#1F1F1F]"
              >
                <PiXLight className="text-[24px]" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
              {passwordSubmitError ? (
                <AlertBannerComponent
                  variant="error"
                  message={passwordSubmitError}
                />
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#555555]">
                  Current Password
                </span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    updatePasswordField("currentPassword", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#D8D8D8] px-3 text-base text-[#2F2F2F] outline-none transition focus:border-[#C2D4FA] md:h-13"
                />
                {passwordErrors.currentPassword ? (
                  <p className="mt-1 text-sm text-[#FF3333]">
                    {passwordErrors.currentPassword}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#555555]">
                  New Password
                </span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    updatePasswordField("newPassword", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#D8D8D8] px-3 text-base text-[#2F2F2F] outline-none transition focus:border-[#C2D4FA] md:h-13"
                />
                {passwordErrors.newPassword ? (
                  <p className="mt-1 text-sm text-[#FF3333]">
                    {passwordErrors.newPassword}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#555555]">
                  Confirm Password
                </span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    updatePasswordField("confirmPassword", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#D8D8D8] px-3 text-base text-[#2F2F2F] outline-none transition focus:border-[#C2D4FA] md:h-13"
                />
                {passwordErrors.confirmPassword ? (
                  <p className="mt-1 text-sm text-[#FF3333]">
                    {passwordErrors.confirmPassword}
                  </p>
                ) : null}
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isSavingPassword}
                  className="h-12 rounded-[10px] border border-[#D9D9D9] px-4 text-base font-medium text-[#555555] transition hover:bg-[#F8F8F8] md:h-13"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="h-12 rounded-[10px] bg-[#3572EF] px-4 text-base font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7FA2F4] md:h-13"
                >
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmationModalComponent
        open={isSaveConfirmOpen}
        title="Save settings?"
        description="Confirm that you want to save the current account changes."
        confirmLabel="Save Changes"
        cancelLabel="Cancel"
        busy={isSavingAccount}
        busyLabel="Saving..."
        onCancel={closeSaveConfirmModal}
        onConfirm={confirmSaveChanges}
      />

      <ConfirmationModalComponent
        open={isDeleteConfirmOpen}
        title="Delete picture?"
        description="This will remove the current profile picture from your account."
        confirmLabel="Delete Picture"
        cancelLabel="Cancel"
        busy={isDeletingPicture}
        busyLabel="Deleting..."
        onCancel={closeDeleteConfirmModal}
        onConfirm={confirmDeletePicture}
      />

      <ConfirmationModalComponent
        open={isPasswordConfirmOpen}
        title="Confirm password change?"
        description="This will update your account password after confirmation."
        confirmLabel="Update Password"
        cancelLabel="Cancel"
        busy={isSavingPassword}
        busyLabel="Updating..."
        onCancel={closePasswordConfirmModal}
        onConfirm={confirmPasswordChange}
      />
    </DashboardLayout>
  );
};

export default SettingsView;
