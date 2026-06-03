import supabase from './supabase';

const AVATAR_BUCKET = 'avatars';

function extensionFromMime(mimeType: string | undefined): string {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/heic':
    case 'image/heic-sequence':
      return 'heic';
    default:
      return 'jpg';
  }
}

export function getAvatarStoragePath(userId: string, mimeType?: string): string {
  const ext = extensionFromMime(mimeType);
  return `${userId}/avatar.${ext}`;
}

export async function uploadProfileAvatar(
  userId: string,
  localUri: string,
  mimeType?: string
): Promise<string> {
  const contentType = mimeType ?? 'image/jpeg';
  const path = getAvatarStoragePath(userId, contentType);

  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ avatar_url: publicUrl } as never)
    .eq('user_id', userId);

  if (profileError) {
    throw profileError;
  }

  await supabase
    .from('users')
    .update({ avatar_url: publicUrl } as never)
    .eq('id', userId);

  return publicUrl;
}

export async function removeProfileAvatar(userId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);

  if (listError) {
    throw listError;
  }

  if (files?.length) {
    const paths = files.map((file) => `${userId}/${file.name}`);
    const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove(paths);
    if (removeError) {
      throw removeError;
    }
  }

  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ avatar_url: null } as never)
    .eq('user_id', userId);

  if (profileError) {
    throw profileError;
  }

  await supabase
    .from('users')
    .update({ avatar_url: null } as never)
    .eq('id', userId);
}