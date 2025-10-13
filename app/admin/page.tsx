'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Upload, BarChart3, TrendingUp, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { PlacesService } from '@/lib/supabase';

interface DashboardStats {
  totalPlaces: number;
  publishedPlaces: number;
  draftPlaces: number;
  featuredPlaces: number;
  totalCuisines: number;
  totalCounties: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPlaces: 0,
    publishedPlaces: 0,
    draftPlaces: 0,
    featuredPlaces: 0,
    totalCuisines: 0,
    totalCounties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStats = await PlacesService.getDashboardStats();
        setStats({
          ...dashboardStats,
          totalCuisines: 23, // This would need a separate query
          totalCounties: 83, // This would need a separate query
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Fallback to mock data if there's an error
        setStats({
          totalPlaces: 0,
          publishedPlaces: 0,
          draftPlaces: 0,
          featuredPlaces: 0,
          totalCuisines: 0,
          totalCounties: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Michigan Munchies admin panel
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Place
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add a new restaurant or food business to the directory
            </p>
            <Link href="/admin/places/new">
              <Button className="w-full">Add Place</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import CSV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Bulk import places from a CSV file
            </p>
            <Link href="/admin/import">
              <Button variant="outline" className="w-full">Import CSV</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed analytics and insights
            </p>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Places</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlaces.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All places in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPlaces.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Live on the site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredPlaces}</div>
            <p className="text-xs text-muted-foreground">
              Highlighted places
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftPlaces}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New place added</p>
                  <p className="text-xs text-muted-foreground">Detroit Pizza Co. - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Place updated</p>
                  <p className="text-xs text-muted-foreground">Grand Rapids Brewery - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">CSV import completed</p>
                  <p className="text-xs text-muted-foreground">25 places imported - 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coverage by County</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Wayne County</span>
                <span className="text-sm font-medium">342 places</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Oakland County</span>
                <span className="text-sm font-medium">189 places</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Kent County</span>
                <span className="text-sm font-medium">156 places</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Macomb County</span>
                <span className="text-sm font-medium">134 places</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {stats.totalCounties} counties covered
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
