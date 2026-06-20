import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Mail, Briefcase, Users, Package, DollarSign, Receipt, Megaphone, FileText, Download, Trash2, Check } from "lucide-react";
import { requireOwner } from "@/lib/owner.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Studio — Ashley Brooke" }]}),
  beforeLoad: async () => {
    try {
      await requireOwner();
    } catch {
      throw redirect({ to: "/" });
    }
  },
  component: Admin,
});

type Tab = "messages" | "applications" | "postings" | "employees" | "products" | "sales" | "expenses" | "announcements";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "messages", label: "Inbox", icon: Mail },
  { key: "applications", label: "Applications", icon: FileText },
  { key: "postings", label: "Job Postings", icon: Briefcase },
  { key: "employees", label: "Employees", icon: Users },
  { key: "products", label: "Products", icon: Package },
  { key: "sales", label: "Sales", icon: DollarSign },
  { key: "expenses", label: "Expenses", icon: Receipt },
  { key: "announcements", label: "Announcements", icon: Megaphone },
];

function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("messages");
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email || "");
      if (!u.user) { setIsOwner(false); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      setIsOwner(!!roles?.some(r => r.role === "owner"));
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  if (isOwner === null) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading studio...</div>;
  }
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Owner access only</h1>
          <p className="text-muted-foreground mb-6">Signed in as {email}. This area is restricted to Ashley.</p>
          <button onClick={signOut} className="rounded-full bg-foreground text-background px-5 py-2 text-sm uppercase tracking-widest">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Studio</p>
            <h1 className="font-display text-2xl font-bold">Owner dashboard</h1>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} className={`flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition ${tab===key?"bg-foreground text-background":"hover:bg-secondary"}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </aside>
        <main className="bg-background border border-border rounded-sm p-6 min-h-[60vh]">
          {tab === "messages" && <Messages />}
          {tab === "applications" && <Applications />}
          {tab === "postings" && <Postings />}
          {tab === "employees" && <Employees />}
          {tab === "products" && <Products />}
          {tab === "sales" && <Sales />}
          {tab === "expenses" && <Expenses />}
          {tab === "announcements" && <Announcements />}
        </main>
      </div>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

const inputCls = "bg-background border border-border rounded px-3 py-2 text-sm w-full";
const btnPrimary = "rounded-full bg-accent text-accent-foreground px-4 py-2 text-xs uppercase tracking-widest";
const btnGhost = "rounded-full border border-border px-3 py-1.5 text-xs";

function fmtCents(c: number) { return `$${(c/100).toFixed(2)}`; }

/* ---------- Messages ---------- */
function Messages() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const toggleRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages"] }),
  });
  return (
    <Section title={`Inbox · ${data.length}`}>
      <div className="space-y-3">
        {data.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
        {data.map((m: any) => (
          <article key={m.id} className={`border rounded p-4 ${m.is_read ? "border-border" : "border-accent bg-accent/5"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-medium">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></p>
                {m.subject && <p className="text-sm text-muted-foreground">{m.subject}</p>}
                <p className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>toggleRead.mutate({id:m.id,is_read:!m.is_read})} className={btnGhost}><Check size={12} className="inline mr-1"/>{m.is_read?"Unread":"Read"}</button>
                <button onClick={()=>{if(confirm("Delete?"))del.mutate(m.id)}} className={btnGhost+" text-destructive"}><Trash2 size={12}/></button>
              </div>
            </div>
            <p className="text-sm mt-3 whitespace-pre-wrap">{m.message}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Applications ---------- */
function Applications() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("applications").select("*, career_postings(title,department)").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const upd = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
  return (
    <Section title={`Applications · ${data.length}`}>
      <div className="space-y-3">
        {data.length === 0 && <p className="text-muted-foreground text-sm">No applications yet.</p>}
        {data.map((a: any) => (
          <article key={a.id} className="border border-border rounded p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-medium">{a.full_name} <span className="text-muted-foreground font-normal">· {a.email}</span></p>
                <p className="text-xs text-muted-foreground">{a.phone || "—"} · {new Date(a.created_at).toLocaleString()}</p>
                <p className="text-xs uppercase tracking-widest text-accent mt-2">
                  {a.career_postings?.department || "General"} · {a.career_postings?.title || "Open application"}
                </p>
              </div>
              <select value={a.status} onChange={(e)=>upd.mutate({id:a.id,status:e.target.value})} className="border border-border bg-background rounded px-2 py-1 text-xs">
                {["new","reviewing","interview","hired","rejected"].map(s=> <option key={s}>{s}</option>)}
              </select>
            </div>
            {a.cover_letter && <p className="text-sm mt-3 whitespace-pre-wrap">{a.cover_letter}</p>}
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Postings ---------- */
function Postings() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["postings_all"],
    queryFn: async () => { const { data, error } = await supabase.from("career_postings").select("*").order("created_at",{ascending:false}); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ title:"", department:"Marketing", description:"", location:"Remote", employment_type:"Full-time" });
  const create = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("career_postings").insert(form); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({queryKey:["postings_all"]}); setForm({title:"",department:"Marketing",description:"",location:"Remote",employment_type:"Full-time"}); toast.success("Posting created"); },
    onError: (e:any) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: async ({id,is_active}:{id:string;is_active:boolean})=>{const {error}=await supabase.from("career_postings").update({is_active}).eq("id",id); if (error) throw error;},
    onSuccess: () => qc.invalidateQueries({queryKey:["postings_all"]}),
  });
  const del = useMutation({
    mutationFn: async (id:string)=>{const {error}=await supabase.from("career_postings").delete().eq("id",id); if (error) throw error;},
    onSuccess: () => qc.invalidateQueries({queryKey:["postings_all"]}),
  });
  return (
    <Section title="Job Postings">
      <form onSubmit={(e)=>{e.preventDefault(); create.mutate();}} className="grid gap-2 md:grid-cols-2 border border-border rounded p-4 mb-6">
        <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={inputCls}/>
        <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} className={inputCls}>
          {["Marketing","Sales","Touring","Creative","Operations","Engineering"].map(d=><option key={d}>{d}</option>)}
        </select>
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className={inputCls}/>
        <select value={form.employment_type} onChange={e=>setForm({...form,employment_type:e.target.value})} className={inputCls}>
          {["Full-time","Part-time","Contract","Internship"].map(t=><option key={t}>{t}</option>)}
        </select>
        <textarea required placeholder="Description" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={inputCls+" md:col-span-2"}/>
        <button className={btnPrimary+" md:col-span-2 justify-self-start"}>Create posting</button>
      </form>
      <div className="space-y-2">
        {data.map((p:any)=>(
          <div key={p.id} className="flex items-center justify-between gap-3 border border-border rounded p-3 flex-wrap">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.department} · {p.location} · {p.employment_type} · {p.is_active?"Active":"Closed"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>toggle.mutate({id:p.id,is_active:!p.is_active})} className={btnGhost}>{p.is_active?"Close":"Reopen"}</button>
              <button onClick={()=>{if(confirm("Delete?"))del.mutate(p.id)}} className={btnGhost+" text-destructive"}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Employees ---------- */
function Employees() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => { const { data, error } = await supabase.from("employees").select("*").order("hired_at",{ascending:false}); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ full_name:"", email:"", job_title:"", department:"Marketing", pay_rate:"", pay_type:"hourly" });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("employees").insert({
        ...form, pay_rate: form.pay_rate ? Number(form.pay_rate) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["employees"]}); setForm({full_name:"",email:"",job_title:"",department:"Marketing",pay_rate:"",pay_type:"hourly"}); toast.success("Employee hired"); },
    onError: (e:any) => toast.error(e.message),
  });
  const terminate = useMutation({
    mutationFn: async (id:string) => { const { error } = await supabase.from("employees").update({ status:"terminated", terminated_at: new Date().toISOString().slice(0,10) }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({queryKey:["employees"]}),
  });
  return (
    <Section title="Employees">
      <form onSubmit={(e)=>{e.preventDefault(); create.mutate();}} className="grid gap-2 md:grid-cols-3 border border-border rounded p-4 mb-6">
        <input required placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className={inputCls}/>
        <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={inputCls}/>
        <input required placeholder="Job title" value={form.job_title} onChange={e=>setForm({...form,job_title:e.target.value})} className={inputCls}/>
        <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} className={inputCls}>
          {["Marketing","Sales","Touring","Creative","Operations","Admin"].map(d=><option key={d}>{d}</option>)}
        </select>
        <input type="number" step="0.01" placeholder="Pay rate" value={form.pay_rate} onChange={e=>setForm({...form,pay_rate:e.target.value})} className={inputCls}/>
        <select value={form.pay_type} onChange={e=>setForm({...form,pay_type:e.target.value})} className={inputCls}>
          {["hourly","salary","contract"].map(t=><option key={t}>{t}</option>)}
        </select>
        <button className={btnPrimary+" md:col-span-3 justify-self-start"}>Hire employee</button>
      </form>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="py-2">Name</th><th>Title</th><th>Dept</th><th>Pay</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {data.map((e:any)=>(
            <tr key={e.id} className="border-t border-border">
              <td className="py-2">{e.full_name}<br/><span className="text-xs text-muted-foreground">{e.email}</span></td>
              <td>{e.job_title}</td>
              <td>{e.department}</td>
              <td>{e.pay_rate ? `$${e.pay_rate}/${e.pay_type}` : "—"}</td>
              <td><span className={e.status==="active"?"text-accent":"text-muted-foreground"}>{e.status}</span></td>
              <td className="text-right">
                {e.status==="active" && <button onClick={()=>{if(confirm("Terminate this employee?"))terminate.mutate(e.id)}} className={btnGhost+" text-destructive"}>Terminate</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

/* ---------- Products ---------- */
function Products() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["products_all"],
    queryFn: async () => { const { data, error } = await supabase.from("products").select("*").order("created_at",{ascending:false}); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ name:"", description:"", price:"", category:"Merch", inventory:"" });
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        name: form.name, description: form.description, price_cents: Math.round(Number(form.price)*100),
        category: form.category, inventory: form.inventory ? Number(form.inventory) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["products_all"]}); setForm({name:"",description:"",price:"",category:"Merch",inventory:""}); toast.success("Product added"); },
    onError: (e:any) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: async ({id,is_active}:{id:string;is_active:boolean})=>{const {error}=await supabase.from("products").update({is_active}).eq("id",id); if (error) throw error;},
    onSuccess: () => qc.invalidateQueries({queryKey:["products_all"]}),
  });
  return (
    <Section title="Products">
      <form onSubmit={(e)=>{e.preventDefault(); create.mutate();}} className="grid gap-2 md:grid-cols-3 border border-border rounded p-4 mb-6">
        <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputCls+" md:col-span-2"}/>
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputCls}>
          {["Music","Apparel","Accessories","Collectibles","Other"].map(c=><option key={c}>{c}</option>)}
        </select>
        <textarea placeholder="Description" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={inputCls+" md:col-span-3"}/>
        <input required type="number" step="0.01" placeholder="Price (USD)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className={inputCls}/>
        <input type="number" placeholder="Inventory" value={form.inventory} onChange={e=>setForm({...form,inventory:e.target.value})} className={inputCls}/>
        <button className={btnPrimary}>Add product</button>
      </form>
      <div className="space-y-2">
        {data.map((p:any)=>(
          <div key={p.id} className="flex items-center justify-between gap-3 border border-border rounded p-3 flex-wrap">
            <div>
              <p className="font-medium">{p.name} <span className="text-muted-foreground text-xs">· {p.category}</span></p>
              <p className="text-xs text-muted-foreground">{fmtCents(p.price_cents)} · stock: {p.inventory ?? "—"} · {p.is_active?"Active":"Hidden"}</p>
            </div>
            <button onClick={()=>toggle.mutate({id:p.id,is_active:!p.is_active})} className={btnGhost}>{p.is_active?"Hide":"Show"}</button>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Sales ---------- */
function Sales() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => { const { data, error } = await supabase.from("sales").select("*").order("sold_at",{ascending:false}); if (error) throw error; return data; },
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products_for_sale"],
    queryFn: async () => { const { data } = await supabase.from("products").select("id,name,price_cents"); return data || []; },
  });
  const [form, setForm] = useState({ product_id:"", product_name:"", quantity:"1", unit_price:"", tax:"", state_code:"", payment_method:"card", customer_email:"" });
  const create = useMutation({
    mutationFn: async () => {
      const qty = Number(form.quantity)||1;
      const unit = Math.round(Number(form.unit_price)*100);
      const tax = Math.round(Number(form.tax || 0)*100);
      const total = unit*qty + tax;
      const { error } = await supabase.from("sales").insert({
        product_id: form.product_id || null, product_name: form.product_name,
        quantity: qty, unit_price_cents: unit, tax_cents: tax, total_cents: total,
        state_code: form.state_code, payment_method: form.payment_method, customer_email: form.customer_email || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["sales"]}); setForm({product_id:"",product_name:"",quantity:"1",unit_price:"",tax:"",state_code:"",payment_method:"card",customer_email:""}); toast.success("Sale recorded"); },
    onError: (e:any) => toast.error(e.message),
  });

  const totals = useMemo(()=>{
    const gross = data.reduce((s:number,r:any)=>s+r.total_cents,0);
    const tax = data.reduce((s:number,r:any)=>s+r.tax_cents,0);
    return { gross, tax, count: data.length };
  },[data]);

  function exportCsv() {
    const rows = [["Date","Product","Qty","Unit","Tax","Total","State","Method","Customer"]];
    data.forEach((r:any)=>rows.push([
      new Date(r.sold_at).toISOString(), r.product_name, String(r.quantity),
      fmtCents(r.unit_price_cents), fmtCents(r.tax_cents), fmtCents(r.total_cents),
      r.state_code||"", r.payment_method||"", r.customer_email||""
    ]));
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `sales-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Section title="Sales" action={
      <button onClick={exportCsv} className={btnGhost+" inline-flex items-center gap-1"}><Download size={12}/> Export CSV</button>
    }>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Gross revenue" value={fmtCents(totals.gross)}/>
        <Stat label="Sales tax collected" value={fmtCents(totals.tax)}/>
        <Stat label="Orders" value={String(totals.count)}/>
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); create.mutate();}} className="grid gap-2 md:grid-cols-3 border border-border rounded p-4 mb-6">
        <select value={form.product_id} onChange={e=>{const p:any=products.find((x:any)=>x.id===e.target.value); setForm({...form,product_id:e.target.value,product_name:p?.name||form.product_name,unit_price:p?(p.price_cents/100).toFixed(2):form.unit_price});}} className={inputCls}>
          <option value="">-- Pick product (or type below) --</option>
          {products.map((p:any)=> <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input required placeholder="Product name" value={form.product_name} onChange={e=>setForm({...form,product_name:e.target.value})} className={inputCls}/>
        <input required type="number" placeholder="Qty" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className={inputCls}/>
        <input required type="number" step="0.01" placeholder="Unit price USD" value={form.unit_price} onChange={e=>setForm({...form,unit_price:e.target.value})} className={inputCls}/>
        <input type="number" step="0.01" placeholder="Sales tax USD" value={form.tax} onChange={e=>setForm({...form,tax:e.target.value})} className={inputCls}/>
        <input maxLength={2} placeholder="State (e.g. TN)" value={form.state_code} onChange={e=>setForm({...form,state_code:e.target.value.toUpperCase()})} className={inputCls}/>
        <select value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})} className={inputCls}>
          {["card","cash","check","stripe","paypal","other"].map(m=><option key={m}>{m}</option>)}
        </select>
        <input type="email" placeholder="Customer email (opt)" value={form.customer_email} onChange={e=>setForm({...form,customer_email:e.target.value})} className={inputCls+" md:col-span-2"}/>
        <button className={btnPrimary+" md:col-span-3 justify-self-start"}>Record sale</button>
      </form>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="py-2">Date</th><th>Product</th><th>Qty</th><th>Total</th><th>Tax</th><th>State</th></tr>
        </thead>
        <tbody>
          {data.map((s:any)=>(
            <tr key={s.id} className="border-t border-border">
              <td className="py-2">{new Date(s.sold_at).toLocaleDateString()}</td>
              <td>{s.product_name}</td><td>{s.quantity}</td><td>{fmtCents(s.total_cents)}</td><td>{fmtCents(s.tax_cents)}</td><td>{s.state_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

function Stat({label,value}:{label:string;value:string}) {
  return (
    <div className="border border-border rounded p-4 bg-secondary/30">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

/* ---------- Expenses ---------- */
function Expenses() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => { const { data, error } = await supabase.from("expenses").select("*").order("spent_on",{ascending:false}); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ category:"Studio", description:"", amount:"", vendor:"", spent_on: new Date().toISOString().slice(0,10) });
  const create = useMutation({
    mutationFn: async () => {
      const { amount, ...rest } = form;
      const { error } = await supabase.from("expenses").insert({
        ...rest, amount_cents: Math.round(Number(amount)*100),
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["expenses"]}); setForm({category:"Studio",description:"",amount:"",vendor:"",spent_on:new Date().toISOString().slice(0,10)}); toast.success("Expense logged"); },
    onError: (e:any) => toast.error(e.message),
  });
  const total = data.reduce((s:number,r:any)=>s+r.amount_cents,0);
  function exportCsv() {
    const rows = [["Date","Category","Vendor","Description","Amount"]];
    data.forEach((r:any)=>rows.push([r.spent_on, r.category, r.vendor||"", r.description||"", fmtCents(r.amount_cents)]));
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `expenses-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Section title="Expenses" action={<button onClick={exportCsv} className={btnGhost+" inline-flex items-center gap-1"}><Download size={12}/> Export CSV</button>}>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Total expenses" value={fmtCents(total)}/>
        <Stat label="Entries" value={String(data.length)}/>
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); create.mutate();}} className="grid gap-2 md:grid-cols-3 border border-border rounded p-4 mb-6">
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputCls}>
          {["Studio","Travel","Marketing","Production","Payroll","Software","Equipment","Legal","Other"].map(c=><option key={c}>{c}</option>)}
        </select>
        <input placeholder="Vendor" value={form.vendor} onChange={e=>setForm({...form,vendor:e.target.value})} className={inputCls}/>
        <input required type="date" value={form.spent_on} onChange={e=>setForm({...form,spent_on:e.target.value})} className={inputCls}/>
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={inputCls+" md:col-span-2"}/>
        <input required type="number" step="0.01" placeholder="Amount USD" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className={inputCls}/>
        <button className={btnPrimary+" md:col-span-3 justify-self-start"}>Log expense</button>
      </form>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="py-2">Date</th><th>Category</th><th>Vendor</th><th>Description</th><th className="text-right">Amount</th></tr>
        </thead>
        <tbody>
          {data.map((e:any)=>(
            <tr key={e.id} className="border-t border-border">
              <td className="py-2">{e.spent_on}</td><td>{e.category}</td><td>{e.vendor}</td><td>{e.description}</td><td className="text-right">{fmtCents(e.amount_cents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

/* ---------- Announcements ---------- */
function Announcements() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => { const { data, error } = await supabase.from("announcements").select("*").order("created_at",{ascending:false}); if (error) throw error; return data; },
  });
  const [form, setForm] = useState({ title:"", body:"", target_role:"" as string });
  const create = useMutation({
    mutationFn: async () => {
      const payload: any = { title: form.title, body: form.body };
      if (form.target_role) payload.target_role = form.target_role;
      const { error } = await supabase.from("announcements").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({queryKey:["announcements"]}); setForm({title:"",body:"",target_role:""}); toast.success("Announcement posted"); },
    onError: (e:any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id:string)=>{const {error}=await supabase.from("announcements").delete().eq("id",id); if (error) throw error;},
    onSuccess: ()=>qc.invalidateQueries({queryKey:["announcements"]}),
  });
  return (
    <Section title="Announcements">
      <p className="text-sm text-muted-foreground mb-4">Posted to team members. Targeted announcements only appear to the chosen role (Marketers, Sales, Employees).</p>
      <form onSubmit={(e)=>{e.preventDefault(); create.mutate();}} className="grid gap-2 border border-border rounded p-4 mb-6">
        <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={inputCls}/>
        <textarea required rows={4} placeholder="Body" value={form.body} onChange={e=>setForm({...form,body:e.target.value})} className={inputCls}/>
        <select value={form.target_role} onChange={e=>setForm({...form,target_role:e.target.value})} className={inputCls}>
          <option value="">Everyone on the team</option>
          <option value="marketer">Marketers only</option>
          <option value="sales">Sales only</option>
          <option value="employee">Employees only</option>
        </select>
        <button className={btnPrimary+" justify-self-start"}>Post announcement</button>
      </form>
      <div className="space-y-3">
        {data.map((a:any)=>(
          <article key={a.id} className="border border-border rounded p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()} · {a.target_role || "everyone"}</p>
              </div>
              <button onClick={()=>{if(confirm("Delete?"))del.mutate(a.id)}} className={btnGhost+" text-destructive"}><Trash2 size={12}/></button>
            </div>
            <p className="text-sm mt-2 whitespace-pre-wrap">{a.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
