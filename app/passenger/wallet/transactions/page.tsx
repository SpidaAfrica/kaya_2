"use client";
export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeClosed, Plus, X, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import DayDate from "@/components/DayDate";
import { MainContent } from "@/app/layouts/app-layout";
import Script from "next/script";
import { CardChip, WalletBanner } from "@/assets";

// Define type for transaction
type Transaction = {
  id: string;
  date: string;
  title: string;
  reference: string;
  balance: string;
  status: "success" | "pending" | "failed";
  amount: string;
  created_at: string;
  description: string;
  type: "credit" | "debit";
};

// TransactionTile component
const TransactionTile = ({
  id,
  date,
  title,
  reference,
  status,
  amount,
  type,
  description,
  onClick,
}: Transaction & { onClick: () => void }) => {
  const icon = {
    credit: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M5.64608 7.02411L0.130508 1.51048L1.50916 0.130859L7.02473 5.64643L11.85 0.820184V11.8504H0.819833L5.64608 7.02411Z"
          fill="#38C793"
        />
      </svg>
    ),
    debit: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6.351 4.97469L11.8676 10.4893L10.4879 11.8689L4.97333 6.35334L0.147079 11.1796V0.148438H11.1773L6.351 4.97469Z"
          fill="#DF1C41"
        />
      </svg>
    ),
  };

  const bgColor = {
    credit: "bg-green-100",
    debit: "bg-rose-100",
  };

  const amountColor = {
    credit: "text-green-500",
    debit: "text-rose-500",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className="flex justify-between gap-4 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center gap-3 w-full">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${bgColor[type]}`}>
          {icon[type]}
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="text-[15px] font-medium text-gray-900">{title}</div>
          <div className="text-xs text-gray-400">{formattedDate}</div>
          <div className="text-xs text-gray-400">Ref: {reference}</div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end justify-center">
        <div className={`font-semibold text-[15px] ${amountColor[type]}`}>
          {type === "credit" ? "+" : "-"}₦{Number(amount).toLocaleString()}
        </div>
        <Badge
          className={`capitalize text-xs px-2 py-0.5 mt-1 ${
            status === "success"
              ? "bg-green-100 text-green-600"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default function WalletPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  // Load user data from session storage
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedEmail = sessionStorage.getItem("email");
  
    setUserId(storedUserId);
    setEmail(storedEmail);
  }, []);

  
/*
  const openDialog = useCallback(() => setShowPaymentMethods(true), []);
  const toggleDialog = useCallback((state: boolean) => setShowPaymentMethods(state), []);

  const [balance, setBalance] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
*/
  // Fetch wallet balance
/*
  useEffect(() => {
    if (!userId) return;
    
    fetch(`https://spida.africa/kaya-api/get-wallet.php?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance) {
          setBalance(Number(data.balance));
        } else if (data && typeof data === 'object') {
          // Try to find balance in the response
          const possibleBalance = Object.values(data).find(val => 
            !isNaN(Number(val)) || (typeof val === 'string' && !isNaN(Number(val)))
          );
          if (possibleBalance) {
            setBalance(Number(possibleBalance));
          }
        }
      })
      .catch(err => console.error("Error fetching wallet balance:", err));
  }, [userId]);

  // Handle payment process
  /*
  const handlePay = () => {
    if (!userId) {
      alert("User ID is required");
      return;
    }
  
    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      alert("Paystack is not available yet. Please try again.");
      return;
    }
    
    const reference = `TXN-${userId}-${Date.now()}`;
  
    const handler = paystack.setup({
      key: "pk_test_8dbc024aefd873d13976ab80aa449c8aa6134e1d",
      amount: Number(amount) * 100,
      email: email,
      callback: function (response: any) {
        fetch("https://spida.africa/kaya-api/update-wallet.php", {
          method: "POST",
          body: new URLSearchParams({
            user_id: userId || "",
            amount: amount,
            reference: reference,
            description: "Wallet Top Up",
            type: "credit",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("Wallet updated!");
              setShowModal(false);
              setBalance((prev) => prev + Number(amount));
              setAmount("");
            } else {
              alert(data.message || "Error updating wallet.");
            }
          })
          .catch(() => {
            alert("Failed to update wallet on the server.");
          });
      },
      onClose: function () {
        alert("Payment cancelled.");
      },
    });
  
    handler.openIframe();
  };
  
  */
  
  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      const query = new URLSearchParams({
        user_id: userId,
        page: page.toString(),
        type: typeFilter,
        status: statusFilter,
        search,
      });

      try {
        const res = await fetch(`https://spida.africa/kaya-api/get-transactions.php?${query.toString()}`);
        const data = await res.json();
        
        // Match the exact API structure as provided
        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
          
          // Get pagination info
          if (data.pagination && typeof data.pagination === 'object') {
            setTotalPages(data.pagination.totalPages || 1);
            // Optionally set the current page if needed
            // setPage(data.pagination.currentPage);
          } else {
            setTotalPages(1);
          }
        } else {
          console.warn("Unexpected API response format:", data);
          setTransactions([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTransactions();
  }, [typeFilter, statusFilter, search, page, userId]);

  return (
    <>
          <div className="w-[90%] mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl">Recent Transactions</p>
              <Link href="wallet/transactions" className="text-primary">
                View All
              </Link>
            </div>
            <p className="text-foreground/60">
              Quick access to your latest transactions. Check the status or view
              details.
            </p>
          </div>

          <div className="w-[90%] mx-auto">
            <div className="flex flex-col justify-between md:flex-row md:items-center gap-2">
              <div className="flex items-center gap-2">
                <DayDate />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="search"
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
                    <header className="p-2">Filter Options</header>
                    <div className="p-2 space-y-3 border-t border-b">
                      <div>
                        <Select onValueChange={setTypeFilter}>
                          <Label className="text-xs">Transfer Type</Label>
                          <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                            <SelectValue placeholder="select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit">Credit</SelectItem>
                            <SelectItem value="debit">Debit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select onValueChange={setStatusFilter}>
                          <Label className="text-xs">Transaction Status</Label>
                          <SelectTrigger className="p-2 rounded !outline outline-1 outline-foreground/10 focus:outline focus:outline-1">
                            <SelectValue placeholder="select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="w-[90%] mx-auto space-y-3 divide-y">
            {loading ? (
              <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
              transactions.map((txn) => (
                <TransactionTile
                  key={txn.id}
                  id={txn.id}
                  date={txn.created_at}
                  title={txn.description}
                  reference={txn.reference}
                  status={txn.status.toLowerCase() as "success" | "pending" | "failed"}
                  amount={txn.amount}
                  type={txn.type as "credit" | "debit"}
                  balance={txn.balance}
                  description={txn.description}
                  created_at={txn.created_at}
                  onClick={() => console.log("Transaction:", txn.id)}
                />
              ))
            ) : (
              <p>No transactions found.</p>
            )}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
        </div>
      </div>
    </>
  );
}
