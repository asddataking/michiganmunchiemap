'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import Papa from 'papaparse';
import { CSVImportResult, Place } from '@/types';
import { generateSlug } from '@/lib/utils';
import { PlacesService } from '@/lib/supabase';

interface CSVRow {
  name: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zip?: string;
  latitude: string;
  longitude: string;
  cuisines?: string;
  tags?: string;
  price_level?: string;
  rating?: string;
  website?: string;
  phone?: string;
  ig_url?: string;
  is_featured?: string;
  is_verified?: string;
}

export default function CSVImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<CSVImportResult | null>(null);
  const [preview, setPreview] = useState<Place[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
      setPreview([]);
      setErrors([]);
      parseCSV(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  }, []);

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, errors } = results;
        if (errors.length > 0) {
          setErrors(errors.map(e => `Row ${e.row}: ${e.message}`));
          return;
        }

        const places = data.map((row: CSVRow, index) => {
          try {
            return {
              id: `temp-${index}`,
              slug: generateSlug(row.name),
              name: row.name.trim(),
              address: row.address?.trim() || null,
              city: row.city?.trim() || null,
              county: row.county?.trim() || null,
              state: row.state?.trim() || 'MI',
              zip: row.zip?.trim() || null,
              location: {
                type: 'Point' as const,
                coordinates: [
                  parseFloat(row.longitude),
                  parseFloat(row.latitude)
                ],
              },
              cuisines: row.cuisines?.split(',').map(c => c.trim()).filter(Boolean) || [],
              tags: row.tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
              price_level: parseInt(row.price_level || '2'),
              rating: row.rating ? parseFloat(row.rating) : null,
              website: row.website?.trim() || null,
              phone: row.phone?.trim() || null,
              ig_url: row.ig_url?.trim() || null,
              is_featured: row.is_featured?.toLowerCase() === 'true',
              is_verified: row.is_verified?.toLowerCase() === 'true',
              status: 'published' as const,
              hours: {},
              hero_image_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          } catch (error) {
            throw new Error(`Row ${index + 2}: Invalid data format`);
          }
        });

        setPreview(places.slice(0, 5)); // Show first 5 rows as preview
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data } = results;
          let imported = 0;
          let skipped = 0;
          const importErrors: string[] = [];

          for (const [index, row] of data.entries()) {
            try {
              const placeData = {
                slug: generateSlug(row.name),
                name: row.name.trim(),
                address: row.address?.trim() || null,
                city: row.city?.trim() || null,
                county: row.county?.trim() || null,
                state: row.state?.trim() || 'MI',
                zip: row.zip?.trim() || null,
                location: {
                  type: 'Point',
                  coordinates: [
                    parseFloat(row.longitude),
                    parseFloat(row.latitude)
                  ],
                },
                cuisines: row.cuisines?.split(',').map(c => c.trim()).filter(Boolean) || [],
                tags: row.tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
                price_level: parseInt(row.price_level || '2'),
                rating: row.rating ? parseFloat(row.rating) : null,
                website: row.website?.trim() || null,
                phone: row.phone?.trim() || null,
                ig_url: row.ig_url?.trim() || null,
                is_featured: row.is_featured?.toLowerCase() === 'true',
                is_verified: row.is_verified?.toLowerCase() === 'true',
                status: 'published',
                hours: {},
                hero_image_url: null,
              };

              const result = await PlacesService.upsertPlace(placeData);
              
              if (result) {
                imported++;
              } else {
                importErrors.push(`Row ${index + 2}: Failed to save place`);
                skipped++;
              }

            } catch (error) {
              importErrors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
              skipped++;
            }
          }

          setResult({
            success: true,
            imported,
            errors: importErrors,
            skipped,
          });

          setImporting(false);
        },
      });
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        skipped: 0,
      });
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Example Restaurant',
        address: '123 Main St',
        city: 'Detroit',
        county: 'Wayne',
        state: 'MI',
        zip: '48201',
        latitude: '42.3314',
        longitude: '-83.0458',
        cuisines: 'American,Burgers',
        tags: 'Outdoor Seating,Family Friendly',
        price_level: '2',
        rating: '4.5',
        website: 'https://example.com',
        phone: '313-555-0123',
        ig_url: 'https://instagram.com/example',
        is_featured: 'false',
        is_verified: 'true',
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'michigan-munchies-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CSV Import</h1>
        <p className="text-muted-foreground">
          Import multiple places from a CSV file
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Form */}
        <Card>
          <CardHeader>
            <CardTitle>Import Places</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select CSV File
              </label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">File Selected</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              </div>
            )}

            {errors.length > 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Parse Errors</span>
                </div>
                <ul className="text-sm text-destructive space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {preview.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Preview (first 5 rows)</h3>
                <div className="space-y-2">
                  {preview.map((place, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                      <div className="font-medium">{place.name}</div>
                      <div className="text-muted-foreground">
                        {place.city}, {place.county} • {place.cuisines.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="flex-1"
              >
                {importing ? 'Importing...' : 'Import Places'}
              </Button>
              <Button
                variant="outline"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Import results will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      Import {result.success ? 'Completed' : 'Failed'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Imported:</span>
                      <span className="font-medium text-green-600">{result.imported}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skipped:</span>
                      <span className="font-medium text-yellow-600">{result.skipped}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <span className="font-medium text-red-600">{result.errors.length}</span>
                    </div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-700 mb-2">Errors</h4>
                    <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Required Fields</h4>
              <ul className="text-sm space-y-1">
                <li>• <code>name</code> - Restaurant/business name</li>
                <li>• <code>latitude</code> - GPS latitude</li>
                <li>• <code>longitude</code> - GPS longitude</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optional Fields</h4>
              <ul className="text-sm space-y-1">
                <li>• <code>address</code>, <code>city</code>, <code>county</code>, <code>zip</code></li>
                <li>• <code>cuisines</code> - Comma-separated list</li>
                <li>• <code>tags</code> - Comma-separated list</li>
                <li>• <code>price_level</code> - 1-4</li>
                <li>• <code>rating</code> - 0-5</li>
                <li>• <code>website</code>, <code>phone</code>, <code>ig_url</code></li>
                <li>• <code>is_featured</code>, <code>is_verified</code> - true/false</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
