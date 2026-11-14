declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type SupabaseResult = {
  data: Record<string, unknown>[] | null;
  error: { message: string } | null;
};

interface SupabaseQuery extends PromiseLike<SupabaseResult> {
  select(columns: string): SupabaseQuery;
  update(values: Record<string, unknown>): SupabaseQuery;
  insert(values: Record<string, unknown>): SupabaseQuery;
  eq(column: string, value: unknown): SupabaseQuery;
  in(column: string, values: readonly unknown[]): SupabaseQuery;
  gte(column: string, value: string): SupabaseQuery;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(
    url: string,
    key: string
  ): {
    from(table: string): SupabaseQuery;
  };
}
