import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { getInquiries, updateInquiryStatus } from "../../services/catalog";
import type { Inquiry, InquiryStatus } from "../../types/catalog";

const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "Шинэ",
  read: "Уншсан",
  replied: "Хариулсан",
  closed: "Хаасан",
};

const STATUS_CLASSES: Record<InquiryStatus, string> = {
  new: "bg-brand-red/10 text-brand-red",
  read: "bg-brand-brown/10 text-brand-brown",
  replied: "bg-brand-green/10 text-brand-green",
  closed: "bg-neutral-100 text-neutral-500",
};

const STATUS_OPTIONS: InquiryStatus[] = ["new", "read", "replied", "closed"];

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AdminInquiryList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getInquiries()
      .then((nextInquiries) => {
        if (!isMounted) return;
        setInquiries(nextInquiries);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Хүсэлтийн мэдээлэл уншихад алдаа гарлаа.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredInquiries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (statusFilter !== "all" && inquiry.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      return [inquiry.name, inquiry.phone, inquiry.email ?? "", inquiry.message]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [inquiries, search, statusFilter]);

  const counts = useMemo(() => {
    const summary: Record<InquiryStatus, number> = { new: 0, read: 0, replied: 0, closed: 0 };
    for (const inquiry of inquiries) summary[inquiry.status] += 1;
    return summary;
  }, [inquiries]);

  const handleStatusChange = async (inquiry: Inquiry, nextStatus: InquiryStatus) => {
    if (inquiry.status === nextStatus) return;

    setUpdatingId(inquiry.id);
    try {
      const updatedInquiry = await updateInquiryStatus(inquiry.id, nextStatus);
      setInquiries((currentInquiries) =>
        currentInquiries.map((item) => (item.id === inquiry.id ? updatedInquiry : item))
      );
      toast.success("Хүсэлтийн төлөв шинэчлэгдлээ");
    } catch (error) {
      console.error(error);
      toast.error("Төлөв шинэчлэхэд алдаа гарлаа.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Холбоо барих хүсэлтүүд</h1>
          <p className="text-sm text-neutral-500 mt-1">Public сайтаас ирсэн захиалга, лавлагааны жагсаалт.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs rounded-sm bg-brand-red/10 text-brand-red">Шинэ: {counts.new}</span>
          <span className="px-3 py-1 text-xs rounded-sm bg-brand-brown/10 text-brand-brown">Уншсан: {counts.read}</span>
          <span className="px-3 py-1 text-xs rounded-sm bg-brand-green/10 text-brand-green">Хариулсан: {counts.replied}</span>
          <span className="px-3 py-1 text-xs rounded-sm bg-neutral-100 text-neutral-500">Хаасан: {counts.closed}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col md:flex-row md:items-center gap-3 bg-neutral-50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Нэр, утас, и-мэйл, зурвасаар хайх..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | InquiryStatus)}
            className="text-sm border border-neutral-300 rounded-lg py-2 px-3 focus:outline-none focus:border-amber-900 bg-white"
          >
            <option value="all">Бүх төлөв</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-neutral-500">Ачааллаж байна...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">Хүсэлт олдсонгүй.</div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {filteredInquiries.map((inquiry) => (
              <li key={inquiry.id} className="p-5 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-neutral-900">{inquiry.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-sm ${STATUS_CLASSES[inquiry.status]}`}>
                        {STATUS_LABELS[inquiry.status]}
                      </span>
                      <span className="text-xs text-neutral-400">{formatDate(inquiry.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                      <a className="flex items-center gap-1 hover:text-amber-900" href={`tel:${inquiry.phone}`}>
                        <Phone className="w-4 h-4" /> {inquiry.phone}
                      </a>
                      {inquiry.email && (
                        <a className="flex items-center gap-1 hover:text-amber-900" href={`mailto:${inquiry.email}`}>
                          <Mail className="w-4 h-4" /> {inquiry.email}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-neutral-500">Төлөв:</label>
                    <select
                      value={inquiry.status}
                      onChange={(event) => handleStatusChange(inquiry, event.target.value as InquiryStatus)}
                      disabled={updatingId === inquiry.id}
                      className="text-sm border border-neutral-300 rounded-lg py-2 px-3 focus:outline-none focus:border-amber-900 bg-white disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50 border border-neutral-100 rounded-lg p-3">
                  {inquiry.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
