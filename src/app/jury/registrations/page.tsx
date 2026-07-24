import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listRegistrations } from "@/lib/api/registrations";

const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-green-500/15 text-green-700",
  rejected: "bg-red-500/15 text-red-700",
  pending: "bg-yellow-500/15 text-yellow-700",
};

/** Minimal admin view listing registrations — demonstrates `listRegistrations`. */
export default async function RegistrationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/jury/registrations");

  const result = await listRegistrations({ limit: 100 });

  if (!result.ok) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="font-sans text-destructive">{result.error}</p>
      </main>
    );
  }

  const { data, total } = result.data;

  return (
    <main className="mx-auto max-w-4xl p-6 font-sans">
      <h1 className="mb-4 font-heading text-2xl font-extrabold uppercase tracking-wide">
        Registrations <span className="text-muted-foreground">({total})</span>
      </h1>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Team</th>
              <th className="p-3 font-semibold">Dept</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-medium">{r.user_full_name}</td>
                <td className="p-3 text-muted-foreground">{r.user_email}</td>
                <td className="p-3 capitalize">{r.team_name}</td>
                <td className="p-3 capitalize">{r.department}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[r.status] ?? ""}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
