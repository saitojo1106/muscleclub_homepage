import { useState, useEffect, useCallback } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { Database } from '@/types/supabase';

// Define the supported event types
export type SupabaseEventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Generic type for the tables in our database
type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

// Generic type for the rows of a specific table
type TableRow<T extends TableName> = Tables[T]['Row'];

// Options for the hook
interface UseRealtimeSubscriptionOptions<T extends TableName> {
  table: T;
  eventTypes?: SupabaseEventType[];
  schema?: string;
  filters?: {
    column: keyof TableRow<T>;
    value: any;
  }[];
  onInsert?: (payload: RealtimePostgresChangesPayload<TableRow<T>>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<TableRow<T>>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<TableRow<T>>) => void;
}

// Return type of the hook
interface UseRealtimeSubscriptionResult<T extends TableName> {
  data: TableRow<T>[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * A hook for subscribing to Supabase real-time updates
 */
export function useRealtimeSubscription<T extends TableName>(
  options: UseRealtimeSubscriptionOptions<T>
): UseRealtimeSubscriptionResult<T> {
  const {
    table,
    eventTypes = ['*'],
    schema = 'public',
    filters = [],
    onInsert,
    onUpdate,
    onDelete,
  } = options;

  const [data, setData] = useState<TableRow<T>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Start with the base query
      let query = supabase.from(table).select('*');
      
      // Apply any filters
      filters.forEach(filter => {
        query = query.eq(filter.column as string, filter.value);
      });
      
      const { data: initialData, error: queryError } = await query;
      
      if (queryError) {
        throw queryError;
      }
      
      setData(initialData as TableRow<T>[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [table, filters]);
  
  // Set up the real-time subscription
  useEffect(() => {
    fetchData();
    
    // Create a channel for this subscription
    const channelName = `realtime-${table}-${Math.random().toString(36).substring(2, 9)}`;
    let newChannel = supabase.channel(channelName);
    
    // Subscribe to the specified event types
    eventTypes.forEach(eventType => {
      newChannel = newChannel.on(
        'postgres_changes',
        {
          event: eventType,
          schema,
          table,
        },
        (payload: RealtimePostgresChangesPayload<TableRow<T>>) => {
          const { eventType: receivedEventType, new: newRecord, old: oldRecord } = payload;
          
          // Handle different event types
          if (receivedEventType === 'INSERT') {
            if (onInsert) onInsert(payload);
            setData(currentData => [...currentData, newRecord as TableRow<T>]);
          } else if (receivedEventType === 'UPDATE') {
            if (onUpdate) onUpdate(payload);
            setData(currentData => 
              currentData.map(item => 
                (item as any).id === (newRecord as any).id ? (newRecord as TableRow<T>) : item
              )
            );
          } else if (receivedEventType === 'DELETE') {
            if (onDelete) onDelete(payload);
            setData(currentData => 
              currentData.filter(item => (item as any).id !== (oldRecord as any).id)
            );
          }
        }
      );
    });
    
    // Start the subscription
    newChannel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error('Failed to subscribe to real-time changes:', status);
      }
    });
    
    setChannel(newChannel);
    
    // Cleanup function to remove the subscription
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [table, eventTypes, schema, fetchData, onInsert, onUpdate, onDelete]);
  
  // Function to manually refresh the data
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refresh };
}

