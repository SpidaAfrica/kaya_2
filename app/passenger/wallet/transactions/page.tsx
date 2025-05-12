"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import TransactionTile from "../TransactionTile";
import Pagination from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DayDate from "@/components/DayDate";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Transaction = {
  id: string;
  date: string;
  title: string;
  reference: string;
  balance: string;
  status: string;
  amount: string;
  created_at: string;
  description: string;
  type: "credit" | "debit" | "deposit" | "transfer";
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  // Get userId from session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = sessionStorage.getItem("userId");
      if (storedId) {
        setUserId(storedId);
      }
    }
  }, []);

  // Fetch transactions when filters change
  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      
      const query = new URLSearchParams({
        user_id: userId,
        page: page.toString(),
      });

      if (typeFilter) query.append("type", typeFilter);
      if (statusFilter) query.append("status", statusFilter);
      if (search) query.append("search", search);

      try {
        const response = await fetch(`https://spida.africa/kaya-api/get-transactions.php?${query.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setTransactions(data.transactions || []);
          setTotalPages(data.totalPages || 1);
        } else {
          console.error("API error:", data.message || "Unknown error");
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, typeFilter, statusFilter, search, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, search]);

  const handleFilterReset = () => {
    setTypeFilter("");
    setStatusFilter("");
    setSearch("");
  };

  return (
    <div className="w-[95%] md:w-[85%] mx-auto py-12">
      <div className="mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl">Recent Transactions</p>
          <Link href="/transactions" className="text-primary">
            View All
          </Link>
        </div>
        <p className="text-foreground/60">
          Quick access to your latest transactions. Check the status or view
          details.
        </p>
      </div>

      <div className="mx-auto mt-6">
        <div className="flex flex-col justify-between md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2">
            <DayDate />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search"
              className="text-foreground rounded-md bg-background border border-foreground/20 px-2 !py-2 h-auto min-w-60 outline outline-1 outline-foreground/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-3 items-center border-b py-[6px] rounded-md px-2 border">
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 9.5H8.5V8H5.5V9.5ZM0.25 0.5V2H13.75V0.5H0.25ZM2.5 5.75H11.5V4.25H2.5V5.75Z"
                    fill="#525866"
                  />
                </svg>
                <span className="text-sm text-foreground/70">Filter</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 right-0 p-2">
                <header className="p-2 font-medium">Filter Options</header>

                <div className="p-2 space-y-3 border-t border-b">
                  <div>
                    <Select 
                      value={typeFilter} 
                      onValueChange={(v) => setTypeFilter(v)}
                    >
                      <Label className="text-xs">Transfer Type</Label>
                      <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select 
                      value={statusFilter} 
                      onValueChange={(v) => setStatusFilter(v)}
                    >
                      <Label className="text-xs">Transaction Status</Label>
                      <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      className="w-1/2"
                      onClick={handleFilterReset}
                    >
                      Reset
                    </Button>
                    <Button 
                      className="w-1/2"
                      onClick={() => document.body.click()} // Close dropdown
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 space-y-3 divide-y">
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading transactions...</p>
          </div>
        ) : transactions && transactions.length > 0 ? (
          <>
            {transactions.map((txn) => (
              <TransactionTile
                key={txn.id}
                id={txn.id}
                date={txn.created_at}
                title={txn.description}
                reference={txn.reference}
                status={txn.status.toLowerCase() as "success" | "pending" | "failed"}
                amount={txn.amount}
                type={txn.type as "credit" | "debit"}
                description={txn.description}
                onClick={() => console.log("Transaction:", txn.id)}
              />
            ))}
          </>
        ) : (
          <div className="py-8 text-center">
            <p>No transactions found.</p>
          </div>
        )}

        {!loading && transactions && transactions.length > 0 && totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
}



