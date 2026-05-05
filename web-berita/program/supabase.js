const SUPABASE_URL = "https://pilrbtpxprwiwlenklhh.supabase.co";
const SUPABASE_KEY = "sb_publishable_18hr3rEpGRdkfByYhhOj3A_qqs7AUGd";

async function dbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    ...options,
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
