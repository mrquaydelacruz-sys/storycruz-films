import { NextRequest, NextResponse } from 'next/server';

/**
 * Inquiry API Route
 * Forwards form submissions to the CRM API (cruzcontrol.tech)
 * Creates CRM leads, contacts, and email conversations automatically.
 */

const SERVICE_MAP: Record<string, string> = {
  photography: 'Photography',
  videography: 'Videography',
  both: 'Both',
};

const PROJECT_MAP: Record<string, string> = {
  wedding: 'Wedding',
  debut: 'Debut',
  events: 'Events (Birthdays, Baby Shower, Gender Reveal, Christmas Party)',
  'commercial-branding': 'Commercial Branding',
  'real-estate': 'Real Estate',
  lifestyle: 'Lifestyle (Maternity, Newborn, Family, Couple, Graduation, Cake Smash, Milestone)',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = body.partnerName
      ? `${body.fullName} & ${body.partnerName}`
      : body.fullName;

    const serviceLabel = SERVICE_MAP[body.serviceType] || body.serviceType || '';
    const projectLabel = PROJECT_MAP[body.projectType] || body.projectType || '';

    // CRM projectType: use project type (Wedding, Debut, etc.)
    const projectType = projectLabel || 'Other';

    const messageParts = [
      `Service: ${serviceLabel}`,
      `Project type: ${projectLabel}`,
      body.referralSource?.length > 0 && `How they heard about us: ${body.referralSource.join(', ')}`,
      `Date of project or event: ${body.eventDate || 'Not specified'}`,
      body.location && `Location: ${body.location}`,
      body.estimatedBudget && `Estimated Budget: ${body.estimatedBudget}`,
      body.projectDetails && `\nSpecific details:\n${body.projectDetails}`,
    ].filter(Boolean);

    const message = messageParts.join('\n');

    const crmResponse = await fetch('https://cruzcontrol.tech/api/contact-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: body.email,
        phone: body.phone || undefined,
        projectType,
        eventDate: body.eventDate || undefined,
        location: body.location || undefined,
        message,
        workspaceName: 'StoryCruz Films',
      }),
    });

    const crmData = await crmResponse.json().catch(() => ({}));

    if (!crmResponse.ok || !crmData.success) {
      console.error('CRM API error:', crmResponse.status, crmData);
      return NextResponse.json(
        { success: false, error: 'Failed to submit inquiry to CRM' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, leadId: crmData.leadId, conversationId: crmData.conversationId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
