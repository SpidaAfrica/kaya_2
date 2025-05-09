"use client";
export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useState } from "react";
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
import TransactionTile from "./TransactionTile";
import { CardChip, WalletBanner } from "@/assets";
import Script from "next/script";

type Transaction = {
  id: number;
  date: string;
  title: string;
  referenceId: string;
  balance: string;
  status: "pending" | "successful" | "failed";
  amount: string;
  type: "deposit" | "transfer" | "withdrawal";
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
  
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedEmail = sessionStorage.getItem("email");
  
    setUserId(storedUserId);
    setEmail(storedEmail);
  }, []);


  const openDialog = useCallback(() => setShowPaymentMethods(true), []);
  const toggleDialog = useCallback((state: boolean) => setShowPaymentMethods(state), []);

  const [balance, setBalance] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch(`https://spida.africa/kaya-api/get-wallet.php?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setBalance(Number(data.balance));
      })
  }, [userId]);

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
  
  
  useEffect(() => {
    const fetchTransactions = async () => {
      const query = new URLSearchParams({
        user_id: userId || "",
        page: page.toString(),
        type: typeFilter,
        status: statusFilter,
        search,
      });

      try {
        const res = await fetch(`https://spida.africa/kaya-api/get-transactions.php?${query.toString()}`);
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions);
          setTotalPages(data.totalPages);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTransactions();
  }, [typeFilter, statusFilter, search, page, userId]);
 


  

  return (
    <MainContent>
      <div className="md:w-[90%] mx-auto space-y-5">
      <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="beforeInteractive"
      />
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-background rounded-xl mx-6 my-4 overflow-clip md:h-80 h-60">
        <Image src={WalletBanner} alt="banner" className="absolute z-10 w-full h-full object-cover" />
        <div className="relative z-20 w-[90%] mx-auto py-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-lg">Wallet Balance</p>
                <button onClick={() => setHideBalance(!hideBalance)}>
                  {hideBalance ? <EyeClosed /> : <Eye />}
                </button>
              </div>
              <p className="font-semibold text-6xl">
                {hideBalance ? "****" : `₦${balance?.toFixed(2)}`}
              </p>
            </div>
            <Image src={CardChip} alt="card-chip" />
          </div>
          <div className="w-fit ml-auto">
            <Button
              variant="ghost"
              className="w-fit min-w-60 bg-background text-foreground"
              onClick={() => setShowModal(true)}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4.98624 6.36595L0.319214 1.70058L1.48576 0.533203L6.15279 5.20023L10.2357 1.11648V10.4497H0.902489L4.98624 6.36595Z"
                  fill="#1E2023"
                />
              </svg>
              <p>Deposit Funds</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border w-full p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handlePay}>Proceed</Button>
            </div>
          </div>
        </div>
      )}
    </>
{/*
        <div className="w-[90%] mx-auto">
          <button
            onClick={openDialog}
            className="flex items-center gap-2 font-semibold"
          >
            <Plus />
            <p>Add new Payment method</p>
          </button>
        </div>
*/}
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
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
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
                          <SelectItem value="successful">Successful</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
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
            transactions.map((tx) => <TransactionTile key={tx.id} {...tx} />)
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

      <Dialog open={showPaymentMethods} onOpenChange={toggleDialog}>
        <DialogContent className="w-full rounded-xl max-w-[90vw] md:max-w-lg">
          <div className="h-full w-full relative px-6 py-8">
            <DialogTrigger className="absolute top-4 right-4">
              <button>
                <X />
              </button>
            </DialogTrigger>
            <DialogHeader className="flex flex-row items-center justify-between border-b py-2">
              <DialogTitle className="text-lg font-semibold">
                Add a New Payment Method
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="rounded-full bg-emerald-100 p-2">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <div className="font-medium">New Bank Account</div>
                  <div className="text-sm text-gray-500">
                    Securely add your bank account for seamless payments and quick refunds.
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="rounded-full bg-emerald-100 p-2">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <div className="font-medium">New Credit/Debit Card</div>
                  <div className="text-sm text-gray-500">
                    Save your credit or debit card for fast and secure transactions.
                  </div>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainContent>
  );
}
