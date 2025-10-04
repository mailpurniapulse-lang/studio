
'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface Listing {
    slug: string;
    name: string;
    category: string;
    subCategory?: string;
    image: string;
    imageHint: string;
    address: string;
    hours: string;
    phone: string;
    website: string;
}

export interface SubCategory {
    value: string;
    label: string;
}
export interface Category {
    value: string;
    label: string;
    subCategories?: SubCategory[];
}


const listingsDir = path.join(process.cwd(), 'content/listings');

export const getListings = cache(async (): Promise<Listing[]> => {
    try {
        console.log('Looking for listings in:', listingsDir);
        const filenames = await fs.readdir(listingsDir);
        console.log('Found files:', filenames);
        
        // Filter only .md files and remove duplicates
        const mdFiles = [...new Set(filenames.filter(fn => fn.endsWith('.md')))];
        console.log('Markdown files:', mdFiles);

        const listings = await Promise.all(mdFiles.map(async (filename) => {
            try {
                const filePath = path.join(listingsDir, filename);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const { data } = matter(fileContent);
                
                // Get the slug from the filename without .md extension
                const slug = filename.replace(/\.md$/, '');
                
                return {
                    slug,
                    name: data.name || '',
                    category: data.category || '',
                    subCategory: data.subCategory,
                    image: data.image || '',
                    imageHint: data.imageHint || '',
                    address: data.address || '',
                    hours: data.hours || '',
                    phone: data.phone || '',
                    website: data.website || '',
                };
                
                // Check for all required fields
                const requiredFields = ['name', 'category', 'image', 'imageHint', 'address', 'hours', 'phone', 'website'];
                const missingFields = requiredFields.filter(field => !data[field]);
                
                if (missingFields.length > 0) {
                    console.warn(`Missing required fields in ${filename}: ${missingFields.join(', ')}`);
                    return null;
                }
                
                return {
                    slug: filename.replace(/\.md$/, ''),
                    ...data,
                } as Listing;
            } catch (error) {
                console.error(`Error processing ${filename}:`, error);
                return null;
            }
        }));

        // Filter out any null entries and sort
        const validListings = listings.filter((listing): listing is Listing => listing !== null);
        console.log('Processed listings count:', validListings.length);
        
        return validListings.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Failed to get listings:", error);
        return [];
    }
});
