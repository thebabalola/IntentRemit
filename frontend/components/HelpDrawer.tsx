"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] md:w-[500px] z-[101] bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black italic tracking-widest text-celoyellow">
                  HOW DOES INTENTREMIT WORK?
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="text-gray-300 space-y-6 text-sm leading-relaxed">
                <p>
                  This interface is the heart of <strong>IntentRemit</strong>. It is designed to let you send money (remittance) to someone while enforcing <em>how</em> and <em>when</em> they can use it, rather than just giving them all the cash at once.
                </p>

                <p>Here is a step-by-step breakdown of how the interface works and how you should interact with it:</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-base mb-1">1. Connect Your Wallet</h3>
                    <p>Before you can do anything, make sure you have connected your Web3 wallet (like MetaMask, MiniPay, or Valora) using the green <strong>Connect Wallet</strong> button in the top right. You must be on the <strong>Celo Network</strong>.</p>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">2. Select Remittance Goal</h3>
                    <p>You start by selecting the purpose of the money you are sending.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Options:</strong> You can select from preset goals like <code>School Fees</code>, <code>Medical</code>, <code>Rent</code>, or <code>Business</code>, or you can manually type your own specific intent directly into the input field!</li>
                      <li><strong>AI Suggestion:</strong> When you click a goal (e.g., <em>School Fees</em>), a small AI banner appears suggesting the best way to split the money. For School Fees, it suggests locking 90% for future tuition and keeping 10% immediate.</li>
                      <li><strong>Apply Split:</strong> Clicking this button automatically moves your slider to match the AI's advice.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">3. Recipient & Amount</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Recipient Address:</strong> Paste the <code>0x...</code> Celo wallet address of the person receiving the funds.</li>
                      <li><strong>Asset & Total Amount:</strong> Choose whether you are sending <strong>CELO</strong> or <strong>cUSD</strong> from the dropdown, and type in the total amount you want to send.</li>
                      <li><em>Note:</em> You will see the total converted into "Raw Units (Wei)" below the input. This is just the blockchain's raw format for that number.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">4. Immediate vs. Locked Split</h3>
                    <p>This slider is where the magic happens. You use it to divide the Total Amount into two buckets:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Recipient Gets Now:</strong> The percentage of money the recipient can withdraw and spend the exact second you hit send.</li>
                      <li><strong>To Growth Vault (Locked Amount):</strong> The percentage of money that is held back by the smart contract.</li>
                      <li><strong>Yield Protocol:</strong> The UI shows a simulated 1-year growth projection (at 4.5% APY) to demonstrate how the locked money could grow while it sits in the vault. Once created, you can activate real yield!</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">5. Lock Conditions</h3>
                    <p>This determines <em>how</em> the locked money is eventually released to the recipient. You choose one of two options:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Time-Locked:</strong> You select a specific future Date and Time from a calendar dropdown. The smart contract will strictly hold the funds until that exact moment passes.</li>
                      <li><strong>Manual Approval:</strong> This acts as an escrow or multi-sig. If you select this, new fields will appear asking for <strong>Approver Addresses</strong> and <strong>Required Approvals</strong>. The locked funds will only be released when those specific addresses vote to approve it.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">6. Confirm Intent</h3>
                    <p>Once the form is filled, click the large <strong>Confirm Intent</strong> button at the bottom. Your wallet will pop up asking you to sign the transaction.</p>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base mb-1">7. My Dashboard (Tracking)</h3>
                    <p>Once you send it, you can click on the <strong>My Dashboard</strong> tab on the left sidebar.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Here, you will see a list of all the purposeful transfers you've made.</li>
                      <li><strong>Enable Moola Market Yield:</strong> For locked ERC20 tokens (like cUSD), you will see an option to natively deposit the locked funds into Moola Market to earn real yield while the recipient waits!</li>
                      <li>You can see the live countdown timer for Time-Locked funds.</li>
                      <li>If you are the recipient (or testing with your own alternate wallet), this is the same dashboard where you will see the <strong>Claim Immediate</strong> button and the <strong>Unlock Vault</strong> button (which only becomes clickable once the time has passed or approvals are met).</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={onClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-colors uppercase tracking-widest text-sm"
                >
                  Got It
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
