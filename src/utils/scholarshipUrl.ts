import { Scholarship } from '../types/scholarship';

/**
 * Validates whether a given string is a valid absolute HTTP/HTTPS URL.
 */
function isValidHttpUrl(url: unknown): url is string {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('https://') || trimmed.startsWith('http://');
}

/**
 * Returns the VERIFIED official application URL for a scholarship.
 * If no verified direct application URL is available, returns null.
 *
 * Rules:
 * 1. Must use the verified official application URL belonging to that exact scholarship.
 * 2. If the scholarship is on NSP requiring login first, opens the official NSP student login
 *    (https://scholarships.gov.in/student/login) or scheme-specific application portal.
 * 3. Never returns PDF guidelines or internal app routes as application links.
 * 4. Never guesses or invents non-existent URLs.
 */
export function getVerifiedOfficialApplicationUrl(
  scholarship?: Partial<Scholarship> | null
): string | null {
  if (!scholarship) return null;

  // 1. Direct scholarship.official_application_url
  if (isValidHttpUrl(scholarship.official_application_url)) {
    const url = scholarship.official_application_url.trim();
    if (!url.toLowerCase().endsWith('.pdf')) {
      return url;
    }
  }

  // 2. scholarship.application.official_application_url
  if (isValidHttpUrl(scholarship.application?.official_application_url)) {
    const url = scholarship.application.official_application_url.trim();
    if (!url.toLowerCase().endsWith('.pdf')) {
      return url;
    }
  }

  // 3. scholarship.source.official_application_url
  if (isValidHttpUrl(scholarship.source?.official_application_url)) {
    const url = scholarship.source.official_application_url.trim();
    if (!url.toLowerCase().endsWith('.pdf')) {
      return url;
    }
  }

  const id = (scholarship.id || scholarship.scheme_identifier || '').toUpperCase();
  const name = (scholarship.name || '').toUpperCase();

  // 4. MahaDBT (Government of Maharashtra) official application portal
  if (
    id.startsWith('MAHADBT') ||
    scholarship.source_type === 'MAHADBT' ||
    scholarship.source_portal === 'MAHADBT' ||
    scholarship.provider?.toLowerCase().includes('maharashtra')
  ) {
    return 'https://mahadbt.maharashtra.gov.in/Login/Login';
  }

  // 5. AICTE PMSSS (J&K and Ladakh) dedicated official application portal
  if (
    id.includes('PMSSS') ||
    name.includes('PMSSS') ||
    name.includes('JAMMU KASHMIR AND LADAKH') ||
    name.includes('SPECIAL SCHOLARSHIP SCHEME FOR UT OF J&K')
  ) {
    return 'https://aicte-jk-scholarship-gov.in/';
  }

  // 5. Official NSP schemes: National Scholarship Portal official student application & login portal
  if (
    id.startsWith('NSP-') ||
    scholarship.source_type?.toLowerCase().includes('national scholarship') ||
    scholarship.source?.source_document_name?.toLowerCase().includes('nsp') ||
    scholarship.source?.official_portal_url?.includes('scholarships.gov.in')
  ) {
    return 'https://scholarships.gov.in/student/login';
  }

  // 6. If source_url or official_portal_url is a verified web application portal (not a PDF)
  if (
    isValidHttpUrl(scholarship.source?.official_portal_url) &&
    !scholarship.source.official_portal_url.toLowerCase().endsWith('.pdf') &&
    scholarship.source.official_portal_url !== 'about:blank'
  ) {
    return scholarship.source.official_portal_url.trim();
  }

  if (
    isValidHttpUrl(scholarship.source_url) &&
    !scholarship.source_url.toLowerCase().endsWith('.pdf') &&
    scholarship.source_url !== 'about:blank'
  ) {
    return scholarship.source_url.trim();
  }

  return null;
}

/**
 * Returns the verified official source URL (scheme guidelines / specifications / portal).
 */
export function getVerifiedOfficialSourceUrl(
  scholarship?: Partial<Scholarship> | null
): string {
  if (!scholarship) return 'https://scholarships.gov.in/All-Scholarships';

  if (isValidHttpUrl(scholarship.official_source_url)) {
    return scholarship.official_source_url.trim();
  }
  if (isValidHttpUrl(scholarship.official_specification_url)) {
    return scholarship.official_specification_url.trim();
  }
  if (isValidHttpUrl(scholarship.source?.official_specification_url)) {
    return scholarship.source.official_specification_url.trim();
  }
  if (isValidHttpUrl(scholarship.source?.official_source_url)) {
    return scholarship.source.official_source_url.trim();
  }
  if (isValidHttpUrl(scholarship.source?.source_url)) {
    return scholarship.source.source_url.trim();
  }
  if (isValidHttpUrl(scholarship.source_url)) {
    return scholarship.source_url.trim();
  }
  if (isValidHttpUrl(scholarship.source?.official_portal_url)) {
    return scholarship.source.official_portal_url.trim();
  }
  if (
    scholarship?.id?.startsWith('MAHADBT') ||
    scholarship?.source_type === 'MAHADBT' ||
    scholarship?.provider?.toLowerCase().includes('maharashtra')
  ) {
    return 'https://mahadbt.maharashtra.gov.in/';
  }
  return 'https://scholarships.gov.in/All-Scholarships';
}
