import { useEffect, useState, type ChangeEvent } from "react";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useProducts } from "../hooks/useProducts";
import { columns } from "../components/columns";
import { useNavigate } from "react-router-dom";
import { useImportProducts } from "../hooks/useImportProducts";
import { exportProducts } from "../api/products.api";
import type { PaginationState, SortingState } from "@tanstack/react-table";

export default function ProductsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { data, isLoading } = useProducts({
    page: pagination.pageIndex + 1,

    limit: pagination.pageSize,

    search,
  });

  const importMutation = useImportProducts();

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      await importMutation.mutateAsync(file);

      alert("Products imported successfully");
    } catch (error) {
      console.error(error);

      alert("Import failed");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportProducts({
        search: search || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "products.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Export failed");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);

      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, style code, SKU or barcode"
            className="w-full md:w-[350px]"
          />
          <div className="flex gap-2">
            <label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleImport}
              />

              <div className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100">
                {importMutation.isPending ? "Importing..." : "Import Excel"}
              </div>
            </label>

            <Button
              variant="outline"
              onClick={handleExport}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <Button onClick={() => navigate("/products/new")}>Add Product</Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        pagination={pagination}
        pageCount={data?.meta?.totalPages || 0}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
      />
    </div>
  );
}
