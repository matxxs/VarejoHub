"use client"

import PricingTable from "@/components/ui/pricing-table"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">V</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">VarejoHub</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4  ">
                <section id="precos" className="container mx-auto px-4">
                    <PricingTable />
                </section>

            </main>
        </div>
    )
}