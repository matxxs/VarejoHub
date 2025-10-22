"use client"

import PricingTable from "@/components/pricing-table"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Main Content */}
            <main className="container mx-auto px-4  ">
                <section id="precos" className="container mx-auto px-4">
                    <PricingTable />
                </section>

            </main>
        </div>
    )
}