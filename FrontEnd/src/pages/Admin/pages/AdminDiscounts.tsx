import { useMemo, useState } from "react";
import {
  BadgePercent,
  Calendar,
  Check,
  Clock,
  Copy,
  DollarSign,
  Edit2,
  Filter,
  Grid2X2,
  List,
  MoreHorizontal,
  Package,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import AdminShell from "../../../components/admin/AdminShell";
import Dropdown from "../../../components/ui/Dropdown";
import type {
  AdminDiscount,
  DiscountStatus,
  DiscountType,
} from "../../../types/adminDiscounts";
import { useI18n } from "../../../i18n/I18nProvider";

const initialDiscounts: AdminDiscount[] = [
  {
    id: "disc-1",
    code: "VELOURAGLOW",
    title: "Spring Radiance Flash Sale",
    description:
      "Special 25% discount across all luxury serums and delicate cleansers.",
    type: "percentage",
    value: 25,
    minSpend: 50,
    usageLimit: 500,
    usageCount: 342,
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    status: "Active",
    appliesTo: "Serums & Cleansers",
    colorTheme: "rose",
  },
  {
    id: "disc-2",
    code: "WELCOME15",
    title: "New Ritual Welcome Gift",
    description:
      "15% off first ritual order for newly registered Veloura customers.",
    type: "percentage",
    value: 15,
    usageCount: 620,
    startDate: "2026-01-01",
    status: "Active",
    appliesTo: "All products",
    colorTheme: "sage",
  },
  {
    id: "disc-3",
    code: "FREESHIP",
    title: "Complimentary Luxury Shipping",
    description: "Free express shipping on all domestic orders exceeding $75.",
    type: "free_shipping",
    value: 0,
    minSpend: 75,
    usageCount: 280,
    startDate: "2026-06-01",
    status: "Active",
    appliesTo: "All products",
    colorTheme: "lavender",
  },
  {
    id: "disc-4",
    code: "RITUAL20",
    title: "VIP Skincare Sanctuary Voucher",
    description: "Flat $20 discount when building a full routine over $100.",
    type: "fixed",
    value: 20,
    minSpend: 100,
    usageLimit: 250,
    usageCount: 115,
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    status: "Active",
    appliesTo: "All products",
    colorTheme: "amber",
  },
  {
    id: "disc-5",
    code: "AUTUMNHYDRATE",
    title: "Autumn Deep Hydration Care",
    description:
      "Exclusive 30% savings on rich moisturizers and nourishing face oils.",
    type: "percentage",
    value: 30,
    minSpend: 60,
    usageLimit: 300,
    usageCount: 0,
    startDate: "2026-10-01",
    endDate: "2026-11-30",
    status: "Scheduled",
    appliesTo: "Moisturizers & Oils",
    colorTheme: "rose",
  },
  {
    id: "disc-6",
    code: "SUMMERSUN20",
    title: "Summer UV Protection Season",
    description:
      "20% off on all broad-spectrum sun care and soothing after-sun balms.",
    type: "percentage",
    value: 20,
    minSpend: 40,
    usageLimit: 150,
    usageCount: 150,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    status: "Expired",
    appliesTo: "Sun care",
    colorTheme: "amber",
  },
];

function AdminDiscounts() {
  const [discountsList, setDiscountsList] =
    useState<AdminDiscount[]>(initialDiscounts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<DiscountType>("percentage");
  const [formValue, setFormValue] = useState<number>(20);
  const [formMinSpend, setFormMinSpend] = useState<string>("");
  const [formUsageLimit, setFormUsageLimit] = useState<string>("");
  const [formAppliesTo, setFormAppliesTo] = useState("All products");
  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [formEndDate, setFormEndDate] = useState("");
  const [formStatus, setFormStatus] = useState<DiscountStatus>("Active");
  const [formError, setFormError] = useState("");

  const { t, direction } = useI18n();

  const statusOptions = [
    { label: t("admin.allStatus") || "All status", value: "All status" },
    { label: t("admin.statusActive") || "Active", value: "Active" },
    { label: t("admin.statusScheduled") || "Scheduled", value: "Scheduled" },
    { label: t("admin.statusExpired") || "Expired", value: "Expired" },
    { label: t("admin.statusDraft") || "Draft", value: "Draft" },
  ];

  const typeOptions = [
    { label: t("admin.allTypes") || "All types", value: "All types" },
    { label: t("admin.percentage") || "Percentage (%)", value: "percentage" },
    { label: t("admin.fixedAmount") || "Fixed amount ($)", value: "fixed" },
    {
      label: t("admin.freeShipping") || "Free Shipping",
      value: "free_shipping",
    },
  ];

  // Copy code to clipboard
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((curr) => (curr === code ? null : curr));
    }, 2000);
  };

  // Generate random code helper
  const handleGenerateCode = () => {
    const prefixes = ["GLOW", "VELOURA", "RITUAL", "SILK", "BLOOM", "CARE"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormCode(`${randomPrefix}${randomNum}`);
  };

  // Open create modal
  const openCreateModal = () => {
    setModalMode("create");
    setEditingDiscountId(null);
    setFormCode("");
    setFormTitle("");
    setFormDescription("");
    setFormType("percentage");
    setFormValue(20);
    setFormMinSpend("");
    setFormUsageLimit("");
    setFormAppliesTo("All products");
    setFormStartDate(new Date().toISOString().split("T")[0]);
    setFormEndDate("");
    setFormStatus("Active");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (discount: AdminDiscount) => {
    setModalMode("edit");
    setEditingDiscountId(discount.id);
    setFormCode(discount.code);
    setFormTitle(discount.title);
    setFormDescription(discount.description);
    setFormType(discount.type);
    setFormValue(discount.value);
    setFormMinSpend(discount.minSpend ? String(discount.minSpend) : "");
    setFormUsageLimit(discount.usageLimit ? String(discount.usageLimit) : "");
    setFormAppliesTo(discount.appliesTo);
    setFormStartDate(discount.startDate);
    setFormEndDate(discount.endDate || "");
    setFormStatus(discount.status);
    setFormError("");
    setIsModalOpen(true);
  };

  // Duplicate discount
  const handleDuplicate = (discount: AdminDiscount) => {
    const newDiscount: AdminDiscount = {
      ...discount,
      id: `disc-${Date.now()}`,
      code: `${discount.code}_COPY`,
      title: `${discount.title} (Copy)`,
      usageCount: 0,
      status: "Draft",
    };
    setDiscountsList((prev) => [newDiscount, ...prev]);
  };

  // Toggle pause/active status
  const handleToggleStatus = (id: string) => {
    setDiscountsList((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus: DiscountStatus =
            d.status === "Active" ? "Draft" : "Active";
          return { ...d, status: nextStatus };
        }
        return d;
      }),
    );
  };

  // Handle Save Form
  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) {
      setFormError("Coupon code is required");
      return;
    }
    if (!formTitle.trim()) {
      setFormError("Offer title is required");
      return;
    }

    const cleanCode = formCode.trim().toUpperCase().replace(/\s+/g, "");

    if (modalMode === "create") {
      const newDiscount: AdminDiscount = {
        id: `disc-${Date.now()}`,
        code: cleanCode,
        title: formTitle.trim(),
        description:
          formDescription.trim() || "Exclusive Veloura promotional discount.",
        type: formType,
        value: Number(formValue) || 0,
        minSpend: formMinSpend ? Number(formMinSpend) : undefined,
        usageLimit: formUsageLimit ? Number(formUsageLimit) : undefined,
        usageCount: 0,
        startDate: formStartDate,
        endDate: formEndDate ? formEndDate : undefined,
        status: formStatus,
        appliesTo: formAppliesTo.trim() || "All products",
        colorTheme:
          formType === "free_shipping"
            ? "lavender"
            : formType === "fixed"
              ? "amber"
              : "rose",
      };
      setDiscountsList((prev) => [newDiscount, ...prev]);
    } else if (editingDiscountId) {
      setDiscountsList((prev) =>
        prev.map((d) => {
          if (d.id === editingDiscountId) {
            return {
              ...d,
              code: cleanCode,
              title: formTitle.trim(),
              description: formDescription.trim(),
              type: formType,
              value: Number(formValue) || 0,
              minSpend: formMinSpend ? Number(formMinSpend) : undefined,
              usageLimit: formUsageLimit ? Number(formUsageLimit) : undefined,
              startDate: formStartDate,
              endDate: formEndDate ? formEndDate : undefined,
              status: formStatus,
              appliesTo: formAppliesTo.trim() || "All products",
            };
          }
          return d;
        }),
      );
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteDiscount = (id: string) => {
    setDiscountsList((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirmId(null);
  };

  // Filtered list
  const filteredDiscounts = useMemo(() => {
    return discountsList.filter((discount) => {
      const matchesSearch =
        `${discount.code} ${discount.title} ${discount.description} ${discount.appliesTo}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All status" || discount.status === statusFilter;
      const matchesType =
        typeFilter === "All types" || discount.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [discountsList, search, statusFilter, typeFilter]);

  // Statistics calculation
  const totalActive = discountsList.filter((d) => d.status === "Active").length;
  const totalRedemptions = discountsList.reduce(
    (acc, curr) => acc + curr.usageCount,
    0,
  );
  const totalSavingsEstimated = discountsList.reduce((acc, curr) => {
    if (curr.type === "fixed") return acc + curr.value * curr.usageCount;
    if (curr.type === "free_shipping") return acc + 12 * curr.usageCount;
    return acc + curr.usageCount * 18;
  }, 0);

  return (
    <AdminShell activeItem="Discounts">
      <main className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px]">
          {/* Header & Primary Action */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">
                {t("admin.workspace")} / {t("admin.discounts")}
              </p>
              <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">
                {t("admin.discounts")}
              </h2>
              <p className="mt-2 text-sm text-[#806967]">
                {t("admin.manageDiscounts")}
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-[12px] bg-[#6d4946] px-5 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.16)] transition duration-200 hover:bg-[#583a38] active:scale-[0.98] sm:self-auto"
            >
              <Plus size={16} strokeWidth={2.2} />
              <span>{t("admin.addDiscount")}</span>
            </button>
          </div>

          {/* KPI Statistics Cards */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Active Discounts */}
            <div className="relative overflow-hidden rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_4px_16px_rgba(91,55,53,.025)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#a38b83]">
                  {t("admin.activeDiscounts")}
                </p>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3e4dc] text-[#a86f6b]">
                  <BadgePercent size={18} strokeWidth={1.8} />
                </div>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-3xl font-semibold text-[#493331]">
                {totalActive}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#63846f]">
                <TrendingUp size={13} />
                <span>+2 new this month</span>
              </div>
            </div>

            {/* Card 2: Total Redemptions */}
            <div className="relative overflow-hidden rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_4px_16px_rgba(91,55,53,.025)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#a38b83]">
                  {t("admin.totalRedemptions")}
                </p>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#eee8dc] text-[#9a7b52]">
                  <Users size={18} strokeWidth={1.8} />
                </div>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-3xl font-semibold text-[#493331]">
                {totalRedemptions.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#9a7b52]">
                <Sparkles size={13} />
                <span>Used across 890+ orders</span>
              </div>
            </div>

            {/* Card 3: Total Savings Granted */}
            <div className="relative overflow-hidden rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_4px_16px_rgba(91,55,53,.025)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#a38b83]">
                  {t("admin.totalSavings")}
                </p>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e7eee8] text-[#698674]">
                  <DollarSign size={18} strokeWidth={1.8} />
                </div>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-3xl font-semibold text-[#493331]">
                ${totalSavingsEstimated.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#698674]">
                <span>Generated $74.2k volume</span>
              </div>
            </div>

            {/* Card 4: Average Discount Rate */}
            <div className="relative overflow-hidden rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_4px_16px_rgba(91,55,53,.025)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#a38b83]">
                  {t("admin.avgDiscount")}
                </p>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e9e3ed] text-[#806786]">
                  <Tag size={18} strokeWidth={1.8} />
                </div>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-3xl font-semibold text-[#493331]">
                22.5%
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#806786]">
                <span>Optimal conversion rate</span>
              </div>
            </div>
          </section>

          {/* Main Content Area: Filter Bar & Coupons List */}
          <section className="rounded-[20px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6 lg:p-7">
            {/* Toolbar: Search, Filters & View Toggle */}
            <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="m-0 text-base font-bold text-[#493331]">
                  {t("admin.discountCollection")}
                </p>
                <p className="mb-0 mt-1 text-xs text-[#a38b83]">
                  {filteredDiscounts.length}{" "}
                  {filteredDiscounts.length === 1 ? "offer" : "offers"} active
                  or configured
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Input */}
                <label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[260px]">
                  <Search size={16} strokeWidth={1.7} />
                  <input
                    className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]"
                    placeholder={t("admin.searchDiscounts")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label={t("admin.searchDiscounts")}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-[#a38b83] hover:text-[#493331]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>

                {/* Status Filter */}
                <Dropdown
                  className="w-[140px]"
                  value={statusFilter}
                  options={statusOptions}
                  onChange={setStatusFilter}
                  ariaLabel="Filter discounts by status"
                  icon={Filter}
                />

                {/* Type Filter */}
                <Dropdown
                  className="w-[155px]"
                  value={typeFilter}
                  options={typeOptions}
                  onChange={setTypeFilter}
                  ariaLabel="Filter discounts by type"
                  icon={Tag}
                />

                {/* View Mode Toggle */}
                <div className="flex h-10 items-center rounded-full border border-[#eaded5] bg-[#fffaf5] p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`grid h-8 w-8 place-items-center rounded-full transition ${
                      viewMode === "grid"
                        ? "bg-[#6d4946] text-[#fffdf9] shadow-sm"
                        : "text-[#806967] hover:text-[#493331]"
                    }`}
                    title={t("admin.cardView")}
                    aria-label={t("admin.cardView")}
                  >
                    <Grid2X2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`grid h-8 w-8 place-items-center rounded-full transition ${
                      viewMode === "table"
                        ? "bg-[#6d4946] text-[#fffdf9] shadow-sm"
                        : "text-[#806967] hover:text-[#493331]"
                    }`}
                    title={t("admin.tableView")}
                    aria-label={t("admin.tableView")}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredDiscounts.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e4d6cc] bg-[#faf6f1]/60 px-4 py-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ecd5cc] text-[#8e5d5a]">
                  <BadgePercent size={24} />
                </div>
                <p className="mb-1 mt-4 font-['Playfair_Display'] text-xl font-medium text-[#493331]">
                  {t("admin.noDiscounts")}
                </p>
                <p className="max-w-md text-xs text-[#a38b83]">
                  {t("admin.noDiscountsMatch")}
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-[#6d4946] px-4 text-xs font-bold text-[#fffdf9] shadow-sm hover:bg-[#583a38]"
                >
                  <Plus size={14} />
                  <span>{t("admin.addDiscount")}</span>
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid of Luxury Ticket Cards */
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDiscounts.map((discount) => {
                  const isCopied = copiedCode === discount.code;
                  const usagePercent = discount.usageLimit
                    ? Math.min(
                        100,
                        Math.round(
                          (discount.usageCount / discount.usageLimit) * 100,
                        ),
                      )
                    : null;

                  return (
                    <article
                      key={discount.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#eaded5] bg-[#fffaf5] transition-all duration-300 hover:-translate-y-1 hover:border-[#dfcebf] hover:shadow-[0_14px_32px_rgba(91,55,53,.08)]"
                    >
                      {/* Top Header with Value & Status */}
                      <div className="border-b border-[#f0e5de] bg-[#fbf5ee] p-5">
                        <div className="flex items-start justify-between gap-3">
                          {/* Value Tag Badge */}
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 items-center gap-1.5 rounded-full bg-[#6d4946] px-3 font-['Playfair_Display'] text-xs font-bold text-[#fffdf9] shadow-sm">
                              {discount.type === "percentage" &&
                                `${discount.value}% OFF`}
                              {discount.type === "fixed" &&
                                `$${discount.value} OFF`}
                              {discount.type === "free_shipping" && (
                                <>
                                  <Truck size={13} />
                                  <span>FREE SHIPPING</span>
                                </>
                              )}
                              {discount.type === "bogo" && "BUY 1 GET 1"}
                            </span>

                            {discount.minSpend ? (
                              <span className="text-[10px] font-medium text-[#9a7b52]">
                                (Min: ${discount.minSpend})
                              </span>
                            ) : null}
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              discount.status === "Active"
                                ? "bg-[#e4efe7] text-[#557861]"
                                : discount.status === "Scheduled"
                                  ? "bg-[#e9e3ed] text-[#74597b]"
                                  : discount.status === "Expired"
                                    ? "bg-[#eee8e2] text-[#8a7b77]"
                                    : "bg-[#f6ead1] text-[#9a713c]"
                            }`}
                          >
                            {discount.status}
                          </span>
                        </div>

                        {/* Title and Short Description */}
                        <div className="mt-3">
                          <h3 className="m-0 font-['Playfair_Display'] text-lg font-semibold text-[#493331]">
                            {discount.title}
                          </h3>
                          <p className="mb-0 mt-1 line-clamp-2 text-xs leading-5 text-[#8a7067]">
                            {discount.description}
                          </p>
                        </div>
                      </div>

                      {/* Middle Body: Coupon Code Box & Metrics */}
                      <div className="p-5">
                        {/* Interactive Coupon Box */}
                        <div className="relative mb-4 flex items-center justify-between rounded-[12px] border border-dashed border-[#d9c4b7] bg-[#fffdf9] px-3.5 py-2.5 shadow-inner">
                          <div className="flex items-center gap-2">
                            <Tag size={15} className="text-[#a86f6b]" />
                            <span className="font-mono text-xs font-bold tracking-wider text-[#493331]">
                              {discount.code}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(discount.code)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                              isCopied
                                ? "bg-[#e4efe7] text-[#557861]"
                                : "bg-[#f3e4dc] text-[#8e5d5a] hover:bg-[#ecd5cc]"
                            }`}
                            title={t("admin.copyCode")}
                          >
                            {isCopied ? (
                              <>
                                <Check size={12} strokeWidth={2.5} />
                                <span>{t("admin.codeCopied")}</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>{t("admin.copyCode")}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Scope / Applies To */}
                        <div className="mb-3 flex items-center justify-between text-xs text-[#a38b83]">
                          <span className="flex items-center gap-1.5">
                            <Package size={13} />
                            <span>{t("admin.appliesTo")}:</span>
                          </span>
                          <span className="font-semibold text-[#6d4946]">
                            {discount.appliesTo}
                          </span>
                        </div>

                        {/* Usage Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[11px] text-[#a38b83]">
                            <span>{t("admin.usedCount")}</span>
                            <span className="font-semibold text-[#493331]">
                              {discount.usageCount.toLocaleString()}{" "}
                              {discount.usageLimit
                                ? `/ ${discount.usageLimit.toLocaleString()}`
                                : "uses"}
                            </span>
                          </div>
                          {discount.usageLimit && (
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#ebdcd2]">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  (usagePercent || 0) >= 90
                                    ? "bg-[#c86962]"
                                    : "bg-[#a86f6b]"
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Validity Dates */}
                        <div className="flex items-center justify-between text-[11px] text-[#a38b83]">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{discount.startDate}</span>
                          </span>
                          <span>→</span>
                          <span>
                            {discount.endDate ? (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{discount.endDate}</span>
                              </span>
                            ) : (
                              <span className="font-medium text-[#63846f]">
                                {t("admin.noExpiry")}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons Footer */}
                      <div className="flex items-center justify-between border-t border-[#f0e5de] bg-[#fbf5ee]/80 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(discount.id)}
                          className={`text-[11px] font-bold transition hover:underline ${
                            discount.status === "Active"
                              ? "text-[#9a713c]"
                              : "text-[#63846f]"
                          }`}
                        >
                          {discount.status === "Active"
                            ? t("admin.pause")
                            : t("admin.resume")}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(discount)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#806967] transition hover:bg-[#fffdf9] hover:text-[#493331]"
                            title={t("admin.duplicate")}
                            aria-label={t("admin.duplicate")}
                          >
                            <RotateCw size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(discount)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#806967] transition hover:bg-[#fffdf9] hover:text-[#493331]"
                            title={t("admin.editDiscount")}
                            aria-label={t("admin.editDiscount")}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(discount.id)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#b86259] transition hover:bg-[#feebe9]"
                            title={t("admin.delete")}
                            aria-label={t("admin.delete")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Responsive Table View */
              <div className="overflow-x-auto rounded-[14px] border border-[#eaded5]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#eaded5] bg-[#f8f3ed] text-[11px] font-bold uppercase tracking-wider text-[#8e5d5a]">
                    <tr>
                      <th className="px-4 py-3.5">{t("admin.couponCode")}</th>
                      <th className="px-4 py-3.5">
                        {t("admin.discountTitle")}
                      </th>
                      <th className="px-4 py-3.5">
                        {t("admin.discountValue")}
                      </th>
                      <th className="px-4 py-3.5">{t("admin.appliesTo")}</th>
                      <th className="px-4 py-3.5">{t("admin.usedCount")}</th>
                      <th className="px-4 py-3.5">{t("admin.status")}</th>
                      <th className="px-4 py-3.5 text-right">
                        {t("admin.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0e5de] bg-[#fffdf9]">
                    {filteredDiscounts.map((discount) => {
                      const isCopied = copiedCode === discount.code;
                      return (
                        <tr
                          key={discount.id}
                          className="transition hover:bg-[#faf5ee]"
                        >
                          <td className="whitespace-nowrap px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#493331]">
                                {discount.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(discount.code)}
                                className="text-[#a38b83] transition hover:text-[#6d4946]"
                                title={t("admin.copyCode")}
                              >
                                {isCopied ? (
                                  <Check size={13} className="text-[#557861]" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="m-0 font-medium text-[#493331]">
                              {discount.title}
                            </p>
                            <p className="m-0 text-[10px] text-[#a38b83]">
                              {discount.description}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[#6d4946]">
                            {discount.type === "percentage" &&
                              `${discount.value}%`}
                            {discount.type === "fixed" && `$${discount.value}`}
                            {discount.type === "free_shipping" &&
                              "Free Shipping"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[#806967]">
                            {discount.appliesTo}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[#493331]">
                            {discount.usageCount.toLocaleString()}{" "}
                            {discount.usageLimit
                              ? `/ ${discount.usageLimit}`
                              : ""}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                discount.status === "Active"
                                  ? "bg-[#e4efe7] text-[#557861]"
                                  : discount.status === "Scheduled"
                                    ? "bg-[#e9e3ed] text-[#74597b]"
                                    : discount.status === "Expired"
                                      ? "bg-[#eee8e2] text-[#8a7b77]"
                                      : "bg-[#f6ead1] text-[#9a713c]"
                              }`}
                            >
                              {discount.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(discount)}
                                className="grid h-7 w-7 place-items-center rounded-md text-[#806967] hover:bg-[#f0e3da] hover:text-[#493331]"
                                title={t("admin.editDiscount")}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(discount.id)}
                                className="grid h-7 w-7 place-items-center rounded-md text-[#b86259] hover:bg-[#feebe9]"
                                title={t("admin.delete")}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* CREATE & EDIT DISCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#3b2a29]/40 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl rounded-[20px] border border-[#eadcd2] bg-[#fffdf9] p-6 shadow-[0_20px_50px_rgba(59,42,41,.25)] sm:p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#f0e5de] pb-4">
              <div>
                <p className="m-0 text-[10px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">
                  {modalMode === "create"
                    ? "Veloura Promotions"
                    : "Update Campaign"}
                </p>
                <h3 className="m-0 mt-0.5 font-['Playfair_Display'] text-2xl font-semibold text-[#493331]">
                  {modalMode === "create"
                    ? t("admin.createDiscount")
                    : t("admin.editDiscount")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-[#806967] hover:bg-[#f3e4dc]"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDiscount} className="mt-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-[#f3c8c6] bg-[#fdf2f2] px-4 py-2.5 text-xs text-[#c86962]">
                  {formError}
                </div>
              )}

              {/* Coupon Code + Generate Button */}
              <div>
                <label className="block text-xs font-bold text-[#493331]">
                  {t("admin.couponCode")} *
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. VELOURASPRING"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 font-mono text-xs font-bold tracking-wider text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[11px] border border-[#eaded5] bg-[#faf3ed] px-3 text-xs font-semibold text-[#6d4946] hover:bg-[#f3e4dc]"
                  >
                    <Sparkles size={13} />
                    <span>{t("admin.generateCode")}</span>
                  </button>
                </div>
              </div>

              {/* Offer Title */}
              <div>
                <label className="block text-xs font-bold text-[#493331]">
                  {t("admin.discountTitle")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring Radiance Flash Sale"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
                />
              </div>

              {/* Offer Description */}
              <div>
                <label className="block text-xs font-bold text-[#493331]">
                  {t("admin.description")}
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe offer conditions and benefits..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] focus:ring-1 focus:ring-[#a86f6b]"
                />
              </div>

              {/* Type & Value in Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.discountType")}
                  </label>
                  <select
                    value={formType}
                    onChange={(e) =>
                      setFormType(e.target.value as DiscountType)
                    }
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {formType === "percentage"
                      ? "Discount Percentage (%)"
                      : formType === "fixed"
                        ? "Discount Amount ($)"
                        : "Free Shipping Threshold ($)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    disabled={formType === "free_shipping"}
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b] disabled:bg-[#f2ece6] disabled:text-[#a38b83]"
                  />
                </div>
              </div>

              {/* Min Spend & Usage Limit */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.minSpend")} ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50 (Optional)"
                    value={formMinSpend}
                    onChange={(e) => setFormMinSpend(e.target.value)}
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.usageLimit")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500 (Empty = Unlimited)"
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(e.target.value)}
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  />
                </div>
              </div>

              {/* Applies to & Status */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.appliesTo")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. All products / Serums"
                    value={formAppliesTo}
                    onChange={(e) => setFormAppliesTo(e.target.value)}
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.status")}
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as DiscountStatus)
                    }
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3 py-2.5 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.startDate")}
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#493331]">
                    {t("admin.endDate")} (Optional)
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="mt-1 w-full rounded-[11px] border border-[#e7d9d0] bg-[#fffaf5] px-3.5 py-2 text-xs text-[#493331] outline-none transition focus:border-[#a86f6b]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#f0e5de] pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-[11px] border border-[#eaded5] bg-[#faf6f1] px-5 py-2.5 text-xs font-semibold text-[#806967] hover:bg-[#f1e6de]"
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-[11px] bg-[#6d4946] px-6 py-2.5 text-xs font-bold text-[#fffdf9] shadow-[0_4px_14px_rgba(109,73,70,.18)] transition hover:bg-[#583a38]"
                >
                  {modalMode === "create"
                    ? t("admin.createDiscount")
                    : t("admin.saveDiscount")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3b2a29]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[20px] border border-[#eadcd2] bg-[#fffdf9] p-6 shadow-[0_20px_50px_rgba(59,42,41,.25)]">
            <h3 className="m-0 font-['Playfair_Display'] text-xl font-bold text-[#493331]">
              {t("admin.deleteDiscountTitle")}
            </h3>
            <p className="mb-0 mt-3 text-xs leading-5 text-[#806967]">
              {t("admin.deleteDiscountConfirm")}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-[11px] border border-[#eaded5] bg-[#faf6f1] px-4 py-2 text-xs font-semibold text-[#806967] hover:bg-[#f1e6de]"
              >
                {t("admin.cancel")}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDiscount(deleteConfirmId)}
                className="rounded-[11px] bg-[#c86962] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b0554f]"
              >
                {t("admin.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

export default AdminDiscounts;
