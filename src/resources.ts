import { onCleanup, createResource } from "solid-js";
import { type RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./api";

interface Props<TableName extends Table> {
  table: TableName;
  id: Tables[TableName]["Row"];
}

export const createRealtimeResource = <TableName extends Table>({
  table,
  id,
}: Props<TableName>) => {
  type Row = Tables[TableName]["Row"];

  const [value, actions] = createResource<Row>(async () => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    onReady();
    return data;
  });

  let channel: RealtimeChannel;
  function onReady() {
    channel = supabase
      .channel(`public:${table}:id=eq.${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: table,
          filter: `id=eq.${id}`,
        },
        ({ new: newState }) => {
          actions.mutate(newState as Exclude<Row, Function>);
        }
      )
      .subscribe((_, error) => {
        if (error) throw error;
      });
  }

  onCleanup(() => {
    if (channel) channel.unsubscribe();
  });

  return value;
};
