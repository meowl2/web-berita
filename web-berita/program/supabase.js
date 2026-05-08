const SUPABASE_URL = "https://pilrbtpxprwiwlenklhh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbHJidHB4cHJ3aXdsZW5rbGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODUzODksImV4cCI6MjA5MzU2MTM4OX0.oWHgsH8MWvk27Y3L4afdVu7JCsBoAcglDEZvbsVQ_s0";

async function dbFetch(path, options = {}) {
  const session = getSession();
  const token = session?.access_token ?? SUPABASE_KEY;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}
export async function getAllNews() {
  return dbFetch("news?select=*&order=created_at.desc");
}

export async function getNewsById(id) {
  const rows = await dbFetch(`news?id=eq.${id}&select=*`);
  return rows?.[0] ?? null;
}

export async function insertNews(item) {
  const rows = await dbFetch("news", {
    method: "POST",
    body: JSON.stringify(item),
  });
  return rows?.[0];
}

export async function deleteNewsById(id) {
  return dbFetch(`news?id=eq.${id}`, { method: "DELETE" });
}

// upload image
export async function uploadImage(file) {
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/news-images/${filename}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": file.type,
      },
      body: file,
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return `${SUPABASE_URL}/storage/v1/object/public/news-images/${filename}`;
}

const SUPABASE_AUTH = `${SUPABASE_URL}/auth/v1`;

export async function signUp(email, password, username) {
  const res = await fetch(`${SUPABASE_AUTH}/signup`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, options: { data: { username } } }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_AUTH}/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  localStorage.setItem("sb_session", JSON.stringify(data));
  return data;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("sb_session"));
  } catch {
    return null;
  }
}

export function getUser() {
  return getSession()?.user ?? null;
}

export async function signOut() {
  const session = getSession();
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  localStorage.removeItem("sb_session");
  window.location.href = "index.html";
}

// async function dbFetch(path, options = {}) {
//   const session = getSession();
//   const token = session?.access_token ?? SUPABASE_KEY;

//   const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
//     headers: {
//       apikey: SUPABASE_KEY,
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       Prefer: "return=representation",
//     },
//     ...options,
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.status === 204 ? null : res.json();
// }

console.log("KEY:", SUPABASE_KEY);
console.log("URL:", SUPABASE_URL);