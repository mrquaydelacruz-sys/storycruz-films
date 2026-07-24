import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/writeClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Filter out empty inspiration links
    const inspirationLinks = body.inspirationLinks?.filter((link: string) => link.trim() !== '') || [];

    // Create the document in Sanity
    const doc = {
      _type: 'commercialInquiry',
      status: 'new',

      // Basics
      companyName: body.companyName,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone || '',
      website: body.website || '',
      timeline: body.timeline || '',

      // Scope
      serviceType: body.serviceType,
      projectGoal: body.projectGoal,
      estimatedAssets: body.estimatedAssets || '',
      musicLicensing: body.musicLicensing || false,
      voiceover: body.voiceover || false,

      // Production
      location: body.location || [],
      talent: body.talent || [],
      projectDescription: body.projectDescription,
      inspirationLinks: inspirationLinks,

      // Licensing
      usageTypes: body.usageTypes || [],
      usageDuration: body.usageDuration,

      // Investment
      budget: body.budget,
      additionalNotes: body.additionalNotes || '',

      // Metadata
      submittedAt: new Date().toISOString(),
    };

    const result = await writeClient.create(doc);

    return NextResponse.json(
      { success: true, id: result._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating commercial inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
