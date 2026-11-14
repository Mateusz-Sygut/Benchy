import { File } from 'expo-file-system';
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

export async function uploadProfileAvatar(
  userId: string,
  localUri: string,
  mimeType?: string
): Promise<string> {
  const contentType = mimeType ?? 'image/jpeg';
  const extension = extensionFromMime(contentType);
  const path = `${userId}/${Date.now()}.${extension}`;

  const body = await new File(localUri).arrayBuffer();
  if (body.byteLength === 0) {
    throw new Error('Avatar file is empty');
  }

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, body, {
    contentType,
    upsert: true,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const publicUrl = data.publicUrl;

  const { data: saved, error: profileError } = await supabase
    .from('user_profiles')
    .update({ avatar_url: publicUrl } as never)
    .eq('user_id', userId)
    .select('avatar_url')
    .maybeSingle();

  if (profileError || !(saved as { avatar_url?: string | null } | null)?.avatar_url) {
    throw profileError ?? new Error('Avatar URL was not saved');
  }

  const { error: userError } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl } as never)
    .eq('id', userId);

  if (userError) {
    console.warn('Could not copy avatar URL onto the user row:', userError.message);
  }

  const { data: existing } = await supabase.storage.from(AVATAR_BUCKET).list(userId);
  const stale = (existing ?? [])
    .map((file) => `${userId}/${file.name}`)
    .filter((filePath) => filePath !== path);

  if (stale.length > 0) {
    const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove(stale);
    if (removeError) {
      console.warn('Could not remove the previous avatar file:', removeError.message);
    }
  }

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