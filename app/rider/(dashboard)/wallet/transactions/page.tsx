"use client";
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
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";

interface Transaction {
  id: number;
  date: string;
  title: string;
  referenceId: string;
  balance: string;
  status: string;
  amount: string;
  type: "deposit" | "withdrawal";
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchTransactions = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        search,
        type: filterType,
        status: filterStatus,
        date: filterDate,
      });

      const res = await fetch(`https://www.spida.africa/kaya-api/rider-transactions.php?${query}`);
      const data = await res.json();
      setTransactions(data.transactions);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search, filterType, filterStatus, filterDate]);

  return (
    <div className="w-[95%] md:w-[85%] mx-auto py-12">
      <div className="mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-xl">Recent Transactions</p>
          <Link href={"./"} className="text-primary">
            Back To Wallet
          </Link>
        </div>
        <p className="text-foreground/60">
          Quick access to your latest deliveries! 📦 Check the status or view
          details.
        </p>
      </div>

      <div className="mx-auto">
        <div className="flex flex-col justify-between md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2">
            <DayDate />
          </div>

          <div className="flex items-center gap-2">
            <FormInput
              type="text"
              placeholder="search"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className="text-foreground rounded-md bg-background min-w-60 border-none outline-none"
              wrapperClassName={() =>
                "outline !ring-foreground/10 outline-foreground/10 border-foreground/10"
              }
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
                <header className="p-2">Filter Options</header>

                <div className="p-2 space-y-3 border-t border-b">
                  <div>
                    <Label className="text-xs">Transaction Type</Label>
                    <Select
                      value={filterType}
                      onValueChange={(val) => setFilterType(val)}
                    >
                      <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                        <SelectValue placeholder="select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="transfer">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Transaction Status</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={(val) => setFilterStatus(val)}
                    >
                      <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                        <SelectValue placeholder="select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Date Range</Label>
                    <Select
                      value={filterDate}
                      onValueChange={(val) => setFilterDate(val)}
                    >
                      <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                        <SelectValue placeholder="select date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Time</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="1month">Last 1 Month</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterType("");
                        setFilterStatus("");
                        setFilterDate("");
                      }}
                    >
                      Reset
                    </Button>
                    <Button onClick={() => fetchTransactions()}>Apply</Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="space-y-2 divide-y py-4">
        {transactions.length > 0 ? (
          transactions.map((transaction, i) => (
            <TransactionTile key={i} {...transaction} />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            No transactions found.
          </p>
        )}
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
