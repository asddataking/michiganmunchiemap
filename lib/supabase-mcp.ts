// MCP Supabase client interface
// This file provides a typed interface for the Supabase MCP server

export interface MCPResult<T = any> {
  data: T | null;
  error: string | null;
}

export interface MCPQueryResult<T = any> {
  data: T[];
  error: string | null;
}

export class SupabaseMCPClient {
  private mcp: any;

  constructor(mcpInstance: any) {
    this.mcp = mcpInstance;
  }

  async query<T = any>(
    query: string,
    params: any[] = []
  ): Promise<MCPQueryResult<T>> {
    try {
      const result = await this.mcp.call('supabase', {
        query,
        params,
      });
      return result;
    } catch (error) {
      console.error('MCP Query Error:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async insert(table: string, data: any): Promise<MCPResult> {
    try {
      const result = await this.mcp.call('supabase', {
        action: 'insert',
        table,
        data,
      });
      return result;
    } catch (error) {
      console.error('MCP Insert Error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async update(
    table: string,
    data: any,
    filter: Record<string, any>
  ): Promise<MCPResult> {
    try {
      const result = await this.mcp.call('supabase', {
        action: 'update',
        table,
        data,
        filter,
      });
      return result;
    } catch (error) {
      console.error('MCP Update Error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async delete(table: string, filter: Record<string, any>): Promise<MCPResult> {
    try {
      const result = await this.mcp.call('supabase', {
        action: 'delete',
        table,
        filter,
      });
      return result;
    } catch (error) {
      console.error('MCP Delete Error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async upsert(table: string, data: any): Promise<MCPResult> {
    try {
      const result = await this.mcp.call('supabase', {
        action: 'upsert',
        table,
        data,
      });
      return result;
    } catch (error) {
      console.error('MCP Upsert Error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Specialized methods for our use cases
  async getPlacesInBounds(
    minLng: number,
    minLat: number,
    maxLng: number,
    maxLat: number,
    limit: number = 200
  ): Promise<MCPQueryResult> {
    const query = `
      SELECT * FROM places
      WHERE ST_Intersects(location, ST_MakeEnvelope($1, $2, $3, $4, 4326))
      AND status = 'published'
      ORDER BY is_featured DESC, rating DESC NULLS LAST
      LIMIT $5;
    `;
    return this.query(query, [minLng, minLat, maxLng, maxLat, limit]);
  }

  async getPlaceBySlug(slug: string): Promise<MCPQueryResult> {
    const query = `
      SELECT * FROM places
      WHERE slug = $1 AND status = 'published'
      LIMIT 1;
    `;
    return this.query(query, [slug]);
  }

  async getNearbyPlaces(
    lng: number,
    lat: number,
    radiusMiles: number = 5,
    limit: number = 10
  ): Promise<MCPQueryResult> {
    const query = `
      SELECT *, 
             ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1609.344 as distance_miles
      FROM places
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3 * 1609.344)
      AND status = 'published'
      ORDER BY distance_miles ASC
      LIMIT $4;
    `;
    return this.query(query, [lng, lat, radiusMiles, limit]);
  }

  async searchPlaces(
    searchTerm: string,
    filters: {
      counties?: string[];
      cuisines?: string[];
      tags?: string[];
      priceRange?: [number, number];
      minRating?: number;
      featured?: boolean;
      verified?: boolean;
    } = {},
    limit: number = 50
  ): Promise<MCPQueryResult> {
    let query = `
      SELECT * FROM places
      WHERE status = 'published'
    `;
    const params: any[] = [];
    let paramIndex = 1;

    // Search term
    if (searchTerm) {
      query += ` AND (
        name ILIKE $${paramIndex} OR 
        city ILIKE $${paramIndex} OR 
        county ILIKE $${paramIndex} OR
        address ILIKE $${paramIndex}
      )`;
      params.push(`%${searchTerm}%`);
      paramIndex++;
    }

    // County filter
    if (filters.counties?.length) {
      query += ` AND county = ANY($${paramIndex})`;
      params.push(filters.counties);
      paramIndex++;
    }

    // Cuisine filter
    if (filters.cuisines?.length) {
      query += ` AND cuisines && $${paramIndex}`;
      params.push(filters.cuisines);
      paramIndex++;
    }

    // Tags filter
    if (filters.tags?.length) {
      query += ` AND tags && $${paramIndex}`;
      params.push(filters.tags);
      paramIndex++;
    }

    // Price range filter
    if (filters.priceRange) {
      query += ` AND price_level BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.priceRange[0], filters.priceRange[1]);
      paramIndex += 2;
    }

    // Rating filter
    if (filters.minRating) {
      query += ` AND rating >= $${paramIndex}`;
      params.push(filters.minRating);
      paramIndex++;
    }

    // Featured filter
    if (filters.featured) {
      query += ` AND is_featured = true`;
    }

    // Verified filter
    if (filters.verified) {
      query += ` AND is_verified = true`;
    }

    query += ` ORDER BY is_featured DESC, rating DESC NULLS LAST LIMIT $${paramIndex}`;
    params.push(limit);

    return this.query(query, params);
  }
}

// Singleton instance - will be initialized when MCP is available
let mcpClient: SupabaseMCPClient | null = null;

export function getSupabaseClient(mcpInstance: any): SupabaseMCPClient {
  if (!mcpClient) {
    mcpClient = new SupabaseMCPClient(mcpInstance);
  }
  return mcpClient;
}
