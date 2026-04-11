const ConfirmationModalComponent = ({
  open = false,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busyLabel = "Saving...",
  busy = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  const handleOverlayClick = () => {
    if (!busy) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.32)] px-4"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        className="w-full max-w-[520px] rounded-[10px] bg-white p-6 shadow-[0_22px_60px_rgba(17,24,39,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="confirmation-modal-title"
          className="text-[26px] font-semibold text-[#1F1F1F]"
        >
          {title}
        </h3>
        <p
          id="confirmation-modal-description"
          className="mt-3 text-base leading-relaxed text-[#666666]"
        >
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-12 rounded-[10px] border border-[#D9D9D9] px-5 text-base font-medium text-[#555555] transition hover:bg-[#F8F8F8] disabled:cursor-not-allowed disabled:opacity-70 md:h-13"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="h-12 rounded-[10px] bg-[#3572EF] px-5 text-base font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#7FA2F4] md:h-13"
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalComponent;
