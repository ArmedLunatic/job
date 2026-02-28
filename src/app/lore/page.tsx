import LoreWall from "@/components/job/LoreWall";

export const metadata = {
  title: "Lore Wall | $JOB",
  description:
    "Evidence archive of AI displacement. Screenshots from the timeline — receipts proving AI took your job.",
};

export default function LorePage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoreWall preview={false} />
      </div>
    </main>
  );
}
