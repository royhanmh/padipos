import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiArrowUpRightLight,
  PiBowlFoodLight,
  PiCaretDownLight,
  PiCheckCircleLight,
  PiCoffeeLight,
  PiCookieLight,
  PiPencilSimpleLineLight,
  PiPlusLight,
  PiTrashLight,
  PiUploadSimpleLight,
  PiXLight,
} from "react-icons/pi";
import { useShallow } from "zustand/react/shallow";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProductsStore } from "../../stores/productsStore";
import SkeletonCard from "../../components/SkeletonCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const DEFAULT_IMAGE = "/images/food.png";

const PANEL_MODE = {
  EMPTY: "empty",
  CREATE: "create",
  DETAIL: "detail",
  EDIT: "edit",
};

const categoryOptions = [
  { id: "all", label: "All Menu" },
  { id: "food", label: "Foods", shortLabel: "Food", icon: PiBowlFoodLight },
  {
    id: "beverage",
    label: "Beverages",
    shortLabel: "Beverage",
    icon: PiCoffeeLight,
  },
  {
    id: "dessert",
    label: "Dessert",
    shortLabel: "Dessert",
    icon: PiCookieLight,
  },
];

const selectableCategories = categoryOptions.filter((category) => category.id !== "all");

const categoryMap = categoryOptions.reduce((collection, category) => {
  collection[category.id] = category;
  return collection;
}, {});

const createEmptyFormState = () => ({
  title: "",
  category: "food",
  price: "",
  quantity: "",
  description: "",
  image: DEFAULT_IMAGE,
  imageName: "",
});

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatPriceInput = (value) => {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  return new Intl.NumberFormat("id-ID").format(Number(digitsOnly));
};

const parsePriceInput = (value) => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

const formatQuantityInput = (value) => value.replace(/\D/g, "");

const parseQuantityInput = (value) => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : NaN;
};

const mapMenuToFormState = (menu) => ({
  title: menu.title,
  category: menu.category,
  price: formatPriceInput(String(menu.price)),
  quantity: String(menu.quantity),
  description: menu.description,
  image: menu.image || DEFAULT_IMAGE,
  imageName: "",
});

const validateFormState = (formState) => {
  const nextErrors = {};

  if (!formState.title.trim()) {
    nextErrors.title = "Title is required.";
  }

  if (!formState.description.trim()) {
    nextErrors.description = "Description is required.";
  }

  if (formState.price.trim() === "") {
    nextErrors.price = "Price is required.";
  }

  if (!Number.isInteger(parseQuantityInput(formState.quantity))) {
    nextErrors.quantity = "Quantity is required.";
  }

  return nextErrors;
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

const createToastState = (message) => ({
  id: Date.now(),
  message,
});

const FormField = ({ label, children, error }) => {
  return (
    <label className="block">
      <span className="mb-2.5 block text-base font-medium text-[#4A4A4A]">
        {label}
      </span>
      {children}
      {error ? <p className="mt-2 text-sm text-[#F04438]">{error}</p> : null}
    </label>
  );
};

const ReadOnlyField = ({ label, value, multiline = false }) => {
  const sharedClassName =
    "w-full rounded-[10px] border border-[#D7D7D7] bg-white px-4 text-[15px] text-[#2B2B2B] md:px-5 md:text-[16px]";

  return (
    <div>
      <p className="mb-2.5 text-base font-medium text-[#4A4A4A]">{label}</p>
      {multiline ? (
        <div className={`${sharedClassName} min-h-28 py-4 leading-8 md:leading-9`}>
          {value}
        </div>
      ) : (
        <div className={`${sharedClassName} flex h-12 items-center 2xl:h-12`}>
          {value}
        </div>
      )}
    </div>
  );
};

const PanelFrame = ({ title, actions, children }) => {
  return (
    <aside className="relative flex flex-col rounded-[10px] border border-[#F0F0F0] bg-white px-4 py-4 shadow-[0_14px_36px_rgba(25,45,88,0.05)] xl:h-full xl:min-h-0 2xl:rounded-[20px] 2xl:px-4 2xl:py-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-semibold text-[#161616]">{title}</h2>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
      <div className="mt-6 flex flex-1 flex-col border-t border-[#EFEFEF] pt-5 xl:min-h-0 xl:overflow-y-auto">
        {children}
      </div>
    </aside>
  );
};

const CatalogPage = () => {
  const {
    products: menus,
    isLoading,
    error: requestError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      isLoading: state.isLoading,
      error: state.error,
      fetchProducts: state.fetchProducts,
      createProduct: state.createProduct,
      updateProduct: state.updateProduct,
      deleteProduct: state.deleteProduct,
      clearError: state.clearError,
    })),
  );

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedMenuUuid, setSelectedMenuUuid] = useState(null);
  const [panelMode, setPanelMode] = useState(PANEL_MODE.EMPTY);
  const [panelForm, setPanelForm] = useState(createEmptyFormState);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fileInputRef = useRef(null);

  const selectedMenu = useMemo(
    () => menus.find((menu) => menu.uuid === selectedMenuUuid) ?? null,
    [menus, selectedMenuUuid],
  );

  const filteredMenus = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return menus.filter((menu) => {
      const matchesCategory = activeCategory === "all" || menu.category === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        menu.title.toLowerCase().includes(normalizedSearch) ||
        menu.description.toLowerCase().includes(normalizedSearch) ||
        categoryMap[menu.category]?.label.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, menus, searchValue]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const resetToEmptyPanel = () => {
    setPanelMode(PANEL_MODE.EMPTY);
    setSelectedMenuUuid(null);
    setPanelForm(createEmptyFormState());
    setFormErrors({});
    setIsDeleteDialogOpen(false);
    clearError();
  };

  const handleOpenCreate = () => {
    setPanelMode(PANEL_MODE.CREATE);
    setSelectedMenuUuid(null);
    setPanelForm(createEmptyFormState());
    setFormErrors({});
    clearError();
  };

  const handleSelectMenu = (menuUuid) => {
    setSelectedMenuUuid(menuUuid);
    setPanelMode(PANEL_MODE.DETAIL);
    setFormErrors({});
    clearError();
  };

  const handleOpenEdit = () => {
    if (!selectedMenu) {
      return;
    }

    setPanelMode(PANEL_MODE.EDIT);
    setPanelForm(mapMenuToFormState(selectedMenu));
    setFormErrors({});
    clearError();
  };

  const handleFormChange = (field, value) => {
    setPanelForm((currentState) => ({
      ...currentState,
      [field]:
        field === "price"
          ? formatPriceInput(value)
          : field === "quantity"
            ? formatQuantityInput(value)
            : value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
    clearError();
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    try {
      const preview = await readFileAsDataUrl(file);

      setPanelForm((currentState) => ({
        ...currentState,
        image: preview,
        imageName: file.name,
      }));
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        image: "",
      }));
    } catch {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        image: "The selected image could not be loaded.",
      }));
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files?.[0];
    await handleImageFile(file);
    event.target.value = "";
  };

  const handleDropImage = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    await handleImageFile(file);
  };

  const showSuccessToast = (message) => {
    setToast(createToastState(message));
  };

  const buildPayload = () => ({
    image: panelForm.image || DEFAULT_IMAGE,
    title: panelForm.title.trim(),
    description: panelForm.description.trim(),
    price: parsePriceInput(panelForm.price),
    category: panelForm.category,
    quantity: parseQuantityInput(panelForm.quantity),
  });

  const createMenu = async () => {
    const nextErrors = validateFormState(panelForm);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    try {
      const nextMenu = await createProduct(buildPayload());
      setSelectedMenuUuid(nextMenu.uuid);
      setPanelMode(PANEL_MODE.DETAIL);
      setPanelForm(createEmptyFormState());
      setFormErrors({});
      showSuccessToast("New menu successfully added!");
    } catch {
      return;
    }
  };

  const updateMenuAction = async () => {
    if (!selectedMenu) {
      return;
    }

    const nextErrors = validateFormState(panelForm);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    try {
      const updatedMenu = await updateProduct(selectedMenu.uuid, buildPayload());
      setSelectedMenuUuid(updatedMenu.uuid);
      setPanelMode(PANEL_MODE.DETAIL);
      setFormErrors({});
      showSuccessToast("Menu successfully updated!");
    } catch {
      return;
    }
  };

  const deleteMenuAction = async () => {
    if (!selectedMenu) {
      return;
    }

    try {
      await deleteProduct(selectedMenu.uuid);
      resetToEmptyPanel();
      showSuccessToast("Menu successfully deleted!");
    } catch {
      return;
    }
  };

  const openDeleteDialog = () => {
    if (!selectedMenu) {
      return;
    }

    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (panelMode === PANEL_MODE.CREATE) {
      await createMenu();
      return;
    }

    if (panelMode === PANEL_MODE.EDIT) {
      await updateMenuAction();
    }
  };

  const renderUploadArea = ({ isEdit = false } = {}) => (
    <div className="mb-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {isEdit ? (
        <div>
          <img
            src={panelForm.image || DEFAULT_IMAGE}
            alt={panelForm.title || "Menu preview"}
            className="h-48 w-full rounded-[22px] object-cover 2xl:h-55 2xl:rounded-[24px]"
          />
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleChoosePhoto}
              className="rounded-[10px] border border-[#3572EF] px-6 py-2.5 text-sm font-medium text-[#3572EF] transition hover:bg-[#F2F6FF] md:text-base"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          className="rounded-[10px] border border-dashed border-[#3572EF] px-7 py-11 text-center"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDropImage}
        >
          {panelForm.image !== DEFAULT_IMAGE ? (
            <img
              src={panelForm.image}
              alt={panelForm.title || "Selected preview"}
              className="h-44 w-full rounded-[18px] object-cover 2xl:h-48 2xl:rounded-[20px]"
            />
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D8DDEA] text-[#373737]">
              <PiUploadSimpleLight className="text-[30px]" />
            </div>
          )}
          <p className="mt-5 text-base text-[#2C2C2C]">
            {panelForm.image !== DEFAULT_IMAGE
              ? "Preview selected image"
              : "Drag and Drop your file here or"}
          </p>
          <button
            type="button"
            onClick={handleChoosePhoto}
            className="mt-4 rounded-[10px] bg-[#3572EF] px-6 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(53,114,239,0.22)] transition hover:brightness-105 md:text-base"
          >
            {panelForm.image !== DEFAULT_IMAGE ? "Change File" : "Choose File"}
          </button>
          <p className="mt-3 text-sm text-[#9D9D9D]">
            {panelForm.imageName || "PNG, JPG, or WEBP up to 10MB"}
          </p>
        </div>
      )}

      {formErrors.image ? (
        <p className="mt-2 text-sm text-[#F04438]">{formErrors.image}</p>
      ) : null}
    </div>
  );

  const renderMenuForm = ({ title, isEdit = false }) => (
    <PanelFrame
      title={title}
      actions={
        <button
          type="button"
          aria-label="Close panel"
          onClick={resetToEmptyPanel}
          className="text-[#3F3F3F] transition hover:text-[#151515]"
        >
          <PiXLight className="text-[26px]" />
        </button>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {renderUploadArea({ isEdit })}

        <FormField label="Title" error={formErrors.title}>
          <input
            type="text"
            value={panelForm.title}
            onChange={(event) => handleFormChange("title", event.target.value)}
            placeholder="Enter title here..."
            className="h-12 w-full rounded-[10px] border border-[#D7D7D7] px-4 text-[16px] text-[#2B2B2B] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] md:px-5 2xl:h-12"
          />
        </FormField>

        <FormField label="Category">
          <div className="relative">
            <select
              value={panelForm.category}
              onChange={(event) => handleFormChange("category", event.target.value)}
              className="h-12 w-full appearance-none rounded-[10px] border border-[#D7D7D7] px-4 text-[16px] text-[#2B2B2B] outline-none transition focus:border-[#C8D8FF] md:px-5 2xl:h-12"
            >
              {selectableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.shortLabel}
                </option>
              ))}
            </select>
            <PiCaretDownLight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[22px] text-[#A8A8A8]" />
          </div>
        </FormField>

        <FormField label="Price" error={formErrors.price}>
          <input
            type="text"
            inputMode="numeric"
            value={panelForm.price}
            onChange={(event) => handleFormChange("price", event.target.value)}
            placeholder="Enter price here..."
            className="h-12 w-full rounded-[10px] border border-[#D7D7D7] px-4 text-[16px] text-[#2B2B2B] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] md:px-5 2xl:h-12"
          />
        </FormField>

        <FormField label="Quantity" error={formErrors.quantity}>
          <input
            type="text"
            inputMode="numeric"
            value={panelForm.quantity}
            onChange={(event) => handleFormChange("quantity", event.target.value)}
            placeholder="Enter quantity here..."
            className="h-12 w-full rounded-[10px] border border-[#D7D7D7] px-4 text-[16px] text-[#2B2B2B] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] md:px-5 2xl:h-12"
          />
        </FormField>

        <FormField label="Description" error={formErrors.description}>
          <textarea
            value={panelForm.description}
            onChange={(event) => handleFormChange("description", event.target.value)}
            rows="4"
            placeholder="Add description here..."
            className="w-full rounded-[10px] border border-[#D7D7D7] px-4 py-3.5 text-[16px] text-[#2B2B2B] outline-none transition placeholder:text-[#C3C3C3] focus:border-[#C8D8FF] md:px-5"
          />
        </FormField>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-9 flex h-[54px] w-full items-center justify-center rounded-[10px] bg-[#3572EF] text-base font-medium text-white shadow-[0_12px_28px_rgba(53,114,239,0.24)] transition hover:brightness-105 ${isLoading ? "cursor-not-allowed brightness-95" : ""}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Adding...</span>
            </div>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </PanelFrame>
  );

  const renderDetailPanel = () => {
    if (!selectedMenu) {
      return null;
    }

    return (
      <PanelFrame
        title="Detail Menu"
        actions={
          <>
            <button
              type="button"
              aria-label="Delete menu"
              onClick={openDeleteDialog}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#FF3333] text-[#FF3333] transition hover:bg-[#FFF4F2] md:h-12 md:w-12"
            >
              <PiTrashLight className="text-[20px]" />
            </button>
            <button
              type="button"
              aria-label="Edit menu"
              onClick={handleOpenEdit}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#FFB800] text-[#FFB800] transition hover:bg-[#FFF9E8] md:h-12 md:w-12"
            >
              <PiPencilSimpleLineLight className="text-[20px]" />
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <img
            src={selectedMenu.image}
            alt={selectedMenu.title}
            className="h-48 w-full rounded-[22px] object-cover 2xl:h-55 2xl:rounded-[24px]"
          />

          <ReadOnlyField label="Title" value={selectedMenu.title} />

          <div>
            <p className="mb-2.5 text-base font-medium text-[#4A4A4A]">Category</p>
            <div className="relative flex h-12 items-center rounded-[10px] border border-[#D7D7D7] bg-white px-4 text-[16px] text-[#2B2B2B] md:px-5 2xl:h-12">
              {categoryMap[selectedMenu.category]?.shortLabel}
              <PiCaretDownLight className="absolute right-4 text-[22px] text-[#A8A8A8]" />
            </div>
          </div>

          <ReadOnlyField label="Price" value={formatPriceInput(String(selectedMenu.price))} />

          <ReadOnlyField label="Quantity" value={String(selectedMenu.quantity)} />

          <ReadOnlyField label="Description" value={selectedMenu.description} multiline />
        </div>
      </PanelFrame>
    );
  };

  const renderEmptyPanel = () => (
    <PanelFrame
      title="Add Menu"
      actions={
        <button
          type="button"
          onClick={handleOpenCreate}
          aria-label="Create menu"
          className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#3572EF] text-white shadow-[0_12px_28px_rgba(53,114,239,0.24)] transition hover:brightness-105 md:h-12 md:w-12"
        >
          <PiPlusLight className="text-[22px]" />
        </button>
      }
    >
      <div className="flex flex-1 items-center justify-center px-6 text-center text-[#A2A2A2]">
        <p className="text-[26px] font-medium 2xl:text-[28px]">Add Menu here</p>
      </div>
    </PanelFrame>
  );

  const renderPanel = () => {
    if (panelMode === PANEL_MODE.CREATE) {
      return renderMenuForm({ title: "Add Menu" });
    }

    if (panelMode === PANEL_MODE.DETAIL) {
      return selectedMenu ? renderDetailPanel() : renderEmptyPanel();
    }

    if (panelMode === PANEL_MODE.EDIT) {
      return selectedMenu ? renderMenuForm({ title: "Edit Menu", isEdit: true }) : renderEmptyPanel();
    }

    return renderEmptyPanel();
  };

  return (
    <DashboardLayout
      sidebarProps={{ activeItem: "catalog" }}
      topbarProps={{
        searchValue,
        onSearchChange: setSearchValue,
        searchPlaceholder: "Enter the keyword here...",
      }}
    >
      <section className="min-h-full bg-[#F7F7F7] px-5 py-5 md:px-8 md:py-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:h-[calc(100vh-120px)] xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="min-h-0 xl:flex xl:min-h-0 xl:flex-col">


            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {categoryOptions.map((category) => {
                const isActive = activeCategory === category.id;
                const Icon = category.icon;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex h-[46px] items-center justify-center gap-2 rounded-[12px] border px-4 text-[15px] font-medium transition ${isActive
                        ? "border-[#3572EF] bg-[#3572EF] text-white"
                        : "border-[#BEBEBE] bg-white text-[#A9A9A9] hover:border-[#C2D4FA] hover:text-[#5E5E5E]"
                      }`}
                  >
                    {Icon ? <Icon className="text-[20px]" /> : null}
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-[22px] font-semibold text-[#181818]">List Menu</h1>
              <p className="text-sm text-[#979797]">
                Total <span className="font-medium text-[#515151]">{menus.length}</span> Menu
              </p>
            </div>

            <div className="mt-3 overflow-y-auto pr-1 xl:min-h-0 xl:flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : filteredMenus.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredMenus.map((menu) => {
                    const category = categoryMap[menu.category];
                    const isSelected = selectedMenuUuid === menu.uuid;

                    return (
                      <article
                        key={menu.uuid}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectMenu(menu.uuid)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelectMenu(menu.uuid);
                          }
                        }}
                        className={`flex min-h-[208px] cursor-pointer flex-col rounded-[10px] border bg-white p-3 shadow-[0_8px_24px_rgba(25,45,88,0.05)] transition 2xl:min-h-[214px] ${isSelected
                            ? "border-[#3572EF] shadow-[0_14px_36px_rgba(53,114,239,0.18)]"
                            : "border-transparent hover:-translate-y-0.5 hover:border-[#DCE5FF]"
                          }`}
                      >
                        <div className="relative overflow-hidden rounded-[10px]">
                          <img
                            src={menu.image}
                            alt={menu.title}
                            loading="lazy"
                            className="h-[116px] w-full object-cover 2xl:h-[120px]"
                          />
                          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#3572EF] px-3.5 py-1.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(53,114,239,0.24)]">
                            {category?.shortLabel ?? "Menu"}
                          </span>
                        </div>

                        <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col 2xl:mt-3">
                          <h2 className="line-clamp-1 break-words text-[17px] font-semibold leading-[1.25] tracking-[-0.03em] text-[#161616] 2xl:text-[18px]">
                            {menu.title}
                          </h2>
                          <p className="mt-1.5 min-h-[40px] overflow-hidden break-words line-clamp-2 text-[13px] leading-[1.45] text-[#A0A0A0] 2xl:mt-1.5 2xl:min-h-[38px] 2xl:text-[13px] 2xl:leading-[1.5]">
                            {menu.description}
                          </p>

                          <div className="mt-auto flex items-end justify-between gap-3 pt-1 2xl:pt-3">
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-[#3572EF] 2xl:text-[14px]">
                                {formatCurrency(menu.price)}
                                <span className="ml-1 font-normal text-[#B1B1B1]">/portion</span>
                              </p>
                              <p className="mt-1 text-[12px] text-[#8F8F8F]">Stock {menu.quantity}</p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Open ${menu.title}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSelectMenu(menu.uuid);
                              }}
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition 2xl:h-8 2xl:w-8 ${isSelected
                                  ? "border-[#3572EF] bg-[#3572EF] text-white"
                                  : "border-[#D8DDEA] text-[#6A6A6A] hover:border-[#B6C7FF] hover:text-[#3572EF]"
                                }`}
                            >
                              <PiArrowUpRightLight className="text-[14px] 2xl:text-[16px]" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-84 items-center justify-center rounded-3xl border border-dashed border-[#D7DDEA] bg-white px-7 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-[#2A2A2A]">
                      {requestError ? "Products could not be loaded" : "No menu matched your filters"}
                    </p>
                    <p className="mt-3 text-base text-[#9D9D9D]">
                      {requestError
                        ? requestError
                        : "Try another keyword or switch to a different category."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative xl:min-h-0">
            {toast ? (
              <div className="mb-5 rounded-[10px] border border-[#EAEAEA] bg-white shadow-[0_16px_36px_rgba(25,45,88,0.08)]">
                <div className="flex items-start gap-4 border-l-[3px] border-[#22C55E] px-6 py-6">
                  <PiCheckCircleLight className="mt-0.5 text-[30px] text-[#16A34A]" />
                  <p className="mt-1.5 flex-1 text-base text-[#171717]">{toast.message}</p>
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={() => setToast(null)}
                    className="text-[#3F3F3F] transition hover:text-[#151515]"
                  >
                    <PiXLight className="text-[20px]" />
                  </button>
                </div>
              </div>
            ) : null}

            {requestError ? (
              <div className="mb-5 rounded-[10px] border border-[#FAD7DB] bg-[#FFF7F8] px-6 py-5 text-base text-[#B42318]">
                {requestError}
              </div>
            ) : null}

            {renderPanel()}
          </div>
        </div>

        {isDeleteDialogOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.28)] px-4">
            <div
              className="w-full max-w-[540px] rounded-[20px] bg-white px-8 py-9 text-center shadow-[0_22px_65px_rgba(17,24,39,0.2)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-menu-title"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] border-2 border-[#FF3333] text-[#FF3333]">
                <PiTrashLight className="text-[40px]" />
              </div>

              <h3
                id="delete-menu-title"
                className="mx-auto mt-7 max-w-[340px] text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#121212]"
              >
                Are you sure want to delete this file?
              </h3>

              <div className="mt-9 grid grid-cols-2 gap-5">
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  className="flex h-[54px] items-center justify-center rounded-[10px] border border-[#CFCFCF] text-base font-medium text-[#252525] transition hover:bg-[#F8F8F8]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteMenuAction}
                  disabled={isLoading}
                  className={`flex h-[54px] items-center justify-center rounded-[10px] bg-[#FF3333] text-base font-medium text-white transition hover:brightness-105 ${isLoading ? "cursor-not-allowed brightness-95" : ""}`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </DashboardLayout>
  );
};

export default CatalogPage;
