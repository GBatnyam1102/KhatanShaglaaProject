import { getSupabaseClient } from "../lib/supabase";

export interface AdminProfile {
  id: string;
  role: string;
  full_name: string | null;
}

const ADMIN_ROLES = ["admin", "editor"];

let cachedAdminProfile: AdminProfile | null | undefined = undefined;
let pendingAdminProfile: Promise<AdminProfile | null> | null = null;

function setCachedAdminProfile(profile: AdminProfile | null) {
  cachedAdminProfile = profile;
}

export function getCachedAdminProfile(): AdminProfile | null | undefined {
  return cachedAdminProfile;
}

export function clearAdminProfileCache() {
  cachedAdminProfile = undefined;
  pendingAdminProfile = null;
}

async function getAdminProfileByUserId(userId: string): Promise<AdminProfile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as AdminProfile | null;
}

export async function signInAdmin(email: string, password: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const profile = data.user ? await getAdminProfileByUserId(data.user.id) : null;
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    await supabase.auth.signOut();
    setCachedAdminProfile(null);
    throw new Error("Admin permission is required.");
  }

  setCachedAdminProfile(profile);
  return data;
}

export async function signOutAdmin() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  setCachedAdminProfile(null);
}

export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentAdminProfile(forceRefresh = false): Promise<AdminProfile | null> {
  if (!forceRefresh && cachedAdminProfile !== undefined) {
    return cachedAdminProfile;
  }

  if (pendingAdminProfile) {
    return pendingAdminProfile;
  }

  pendingAdminProfile = (async () => {
    const session = await getCurrentSession();
    if (!session?.user) {
      setCachedAdminProfile(null);
      return null;
    }

    const profile = await getAdminProfileByUserId(session.user.id);
    const allowed = profile && ADMIN_ROLES.includes(profile.role) ? profile : null;
    setCachedAdminProfile(allowed);
    return allowed;
  })();

  try {
    return await pendingAdminProfile;
  } finally {
    pendingAdminProfile = null;
  }
}
