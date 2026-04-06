const PENDING_ARCHIVE_RESTORE_KEY = "cashier-pending-archive-restore";

export const savePendingArchiveRestore = (order) => {
  window.sessionStorage.setItem(
    PENDING_ARCHIVE_RESTORE_KEY,
    JSON.stringify(order),
  );
};

export const readPendingArchiveRestore = () => {
  const value = window.sessionStorage.getItem(PENDING_ARCHIVE_RESTORE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    window.sessionStorage.removeItem(PENDING_ARCHIVE_RESTORE_KEY);
    return null;
  }
};

export const clearPendingArchiveRestore = () => {
  window.sessionStorage.removeItem(PENDING_ARCHIVE_RESTORE_KEY);
};
