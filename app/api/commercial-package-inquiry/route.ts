import { NextRequest, NextResponse } from 'next/server'
import {
  COMMERCIAL_FILMING,
  COMMERCIAL_PROJECT_TYPES,
  estimateCommercialTotal,
  formatCad,
  getCommercialEditOptions,
  type CommercialEditId,
  type CommercialFilmingId,
  type CommercialProjectType,
} from '@/lib/commercial-package-catalog'

const PROJECT_LABEL: Record<CommercialProjectType, string> = Object.fromEntries(
  COMMERCIAL_PROJECT_TYPES.map((p) => [p.value, p.label])
) as Record<CommercialProjectType, string>

/**
 * Corporate package builder → Cruz Control CRM
 * (`https://cruzcontrol.tech/api/contact-form`, workspace StoryCruz Films).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : ''
    const contactPerson =
      typeof body.contactPerson === 'string' ? body.contactPerson.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const projectType = body.projectType as CommercialProjectType | undefined
    const shootDate = typeof body.shootDate === 'string' ? body.shootDate.trim() : ''
    const location = typeof body.location === 'string' ? body.location.trim() : ''
    const durationHint =
      typeof body.durationHint === 'string' ? body.durationHint.trim() : ''
    const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
    const filmingId = body.filmingId as CommercialFilmingId | null
    const editId = body.editId as CommercialEditId | null

    if (!companyName || !contactPerson || !email || !projectType || !filmingId || !editId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const filming = COMMERCIAL_FILMING.find((f) => f.id === filmingId)
    const edit = getCommercialEditOptions(filmingId).find((e) => e.id === editId)
    if (!filming || !edit) {
      return NextResponse.json(
        { success: false, error: 'Invalid package selection' },
        { status: 400 }
      )
    }

    const estimate = estimateCommercialTotal(filmingId, editId)
    const projectLabel = PROJECT_LABEL[projectType] ?? String(projectType)

    const messageParts = [
      '[Corporate package builder — /commercial/package-builder]',
      '',
      `Company: ${companyName}`,
      `Contact: ${contactPerson}`,
      `Project type: ${projectLabel}`,
      shootDate && `Shoot date: ${shootDate}`,
      location && `Location: ${location}`,
      durationHint && `Approx. duration: ${durationHint}`,
      '',
      `Filming & gear: ${filming.title} (${filming.priceLabel})`,
      `Editing & post: ${edit.title} (${edit.priceLabel})`,
      estimate != null && `Approx. combined (pre-tax): ${formatCad(estimate)} + GST`,
      notes && `\nNotes:\n${notes}`,
    ].filter(Boolean)

    const crmResponse = await fetch('https://cruzcontrol.tech/api/contact-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${contactPerson} (${companyName})`,
        email,
        phone: phone || undefined,
        projectType: `Corporate package — ${projectLabel}`,
        eventDate: shootDate || undefined,
        location: location || undefined,
        message: messageParts.join('\n'),
        workspaceName: 'StoryCruz Films',
      }),
    })

    const crmData = await crmResponse.json().catch(() => ({}))

    if (!crmResponse.ok || !crmData.success) {
      console.error('CRM API error (commercial package):', crmResponse.status, crmData)
      return NextResponse.json(
        { success: false, error: 'Failed to submit inquiry to CRM' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, leadId: crmData.leadId, conversationId: crmData.conversationId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing commercial package inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
