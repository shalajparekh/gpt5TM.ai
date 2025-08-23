type USP = { advantage: string; reason: string };

const usps: USP[] = [
  {
    advantage: "🧠 Built for non-tech owners",
    reason: "SMB teams don’t want SaaS complexity—everything is simplified",
  },
  {
    advantage: "⚡ Fast turnaround with AI + templates",
    reason: "Launch faster and cheaper than typical agencies",
  },
  {
    advantage: "💬 Hyper-local trust",
    reason: "Face-to-face reliability matters in Indian SMB selling",
  },
  {
    advantage: "🎯 End-to-end, not siloed",
    reason: "One vendor, fewer handoffs, less confusion",
  },
  {
    advantage: "📦 Productized packages",
    reason: "Clear pricing and scope SMBs can plan and budget for",
  },
];

export default function USPTable({
  title = "Why Nesh Tech?",
  subtitle = "Bangalore-built. AI-powered. SMB-ready.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="w-full py-16 bg-zinc-50 dark:bg-zinc-950" id="why">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <p className="mt-3 text-muted-foreground text-base md:text-lg">{subtitle}</p>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">My Advantage</th>
                <th className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Why it works in your market</th>
              </tr>
            </thead>
            <tbody>
              {usps.map((u) => (
                <tr key={u.advantage} className="">
                  <td className="bg-white dark:bg-zinc-900 p-4 rounded-l-xl border border-r-0 border-black/10 dark:border-white/10">
                    {u.advantage}
                  </td>
                  <td className="bg-white dark:bg-zinc-900 p-4 rounded-r-xl border border-black/10 dark:border-white/10">
                    {u.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

