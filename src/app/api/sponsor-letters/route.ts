import { NextRequest, NextResponse } from "next/server";
import { STRAPI_URL } from "@/lib/utils";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".rtf"];

interface StrapiEntity {
  id: number;
  documentId?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userToken = authHeader?.replace(/^Bearer\s+/i, "").trim();

    if (!userToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await request.formData();
    const childDocumentId = String(formData.get("childDocumentId") || "").trim();
    const childIdRaw = String(formData.get("childId") || "").trim();
    const childName = String(formData.get("childName") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const attachment = formData.get("attachment");

    if (!childDocumentId && !childIdRaw) {
      return NextResponse.json({ error: "Child identifier is required" }, { status: 400 });
    }

    if (!message && !(attachment instanceof File)) {
      return NextResponse.json(
        { error: "Provide a letter message, a document attachment, or both" },
        { status: 400 }
      );
    }

    let uploadedFileId: number | null = null;

    if (attachment instanceof File) {
      const lowerName = attachment.name.toLowerCase();
      const hasAllowedExtension = ALLOWED_FILE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

      if (!hasAllowedExtension) {
        return NextResponse.json(
          { error: "Attachment must be a PDF, DOC, DOCX, TXT, or RTF file" },
          { status: 400 }
        );
      }

      if (attachment.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Attachment must be smaller than 10MB" },
          { status: 400 }
        );
      }
    }

    const meResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      cache: "no-store",
    });

    if (!meResponse.ok) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const me = await meResponse.json();
    const sponsor = await findSponsorByEmail(me.email, userToken);

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor profile not found" }, { status: 404 });
    }

    const child = await findAssignedChild({
      childDocumentId,
      childIdRaw,
      sponsorId: sponsor.id,
      token: userToken,
    });

    if (!child) {
      return NextResponse.json(
        { error: `Child${childName ? ` ${childName}` : ""} was not found for this sponsor` },
        { status: 403 }
      );
    }

    if (attachment instanceof File) {
      uploadedFileId = await uploadAttachmentToStrapi(attachment, userToken);
    }

    const source =
      message && uploadedFileId ? "both" : uploadedFileId ? "attachment" : "message";

    const createResponse = await fetch(`${STRAPI_URL}/api/sponsor-letters`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          subject: subject || null,
          message: message || null,
          source,
          status: "submitted",
          submittedAt: new Date().toISOString(),
          sponsor: sponsor.id,
          child: child.id,
          ...(uploadedFileId ? { attachment: uploadedFileId } : {}),
        },
      }),
    });

    if (!createResponse.ok) {
      const errorData = await safeJson(createResponse);
      console.error("Failed to create sponsor letter:", errorData);
      console.log("Failed to create sponsor letter:", errorData);
      return NextResponse.json({ error: "Failed to save sponsor letter" }, { status: 500 });
    }

    const result = await createResponse.json();
    return NextResponse.json({
      success: true,
      message: "Letter sent successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error creating sponsor letter:", error);
    return NextResponse.json({ error: "Server error processing letter" }, { status: 500 });
  }
}

async function findSponsorByEmail(email: string, token: string): Promise<StrapiEntity | null> {
  const response = await fetch(
    `${STRAPI_URL}/api/sponsors?filters[email][$eq]=${encodeURIComponent(email)}&pagination[pageSize]=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Failed to find sponsor by email");
    return null;
  }

  const data = await response.json();
  return data.data?.[0] ?? null;
}

async function findAssignedChild({
  childDocumentId,
  childIdRaw,
  sponsorId,
  token,
}: {
  childDocumentId: string;
  childIdRaw: string;
  sponsorId: number;
  token: string;
}): Promise<StrapiEntity | null> {
  const filters = childDocumentId
    ? `filters[documentId][$eq]=${encodeURIComponent(childDocumentId)}`
    : `filters[id][$eq]=${encodeURIComponent(childIdRaw)}`;

  const response = await fetch(
    `${STRAPI_URL}/api/children?${filters}&filters[sponsor][id][$eq]=${sponsorId}&pagination[pageSize]=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Failed to find assigned child");
    return null;
  }

  const data = await response.json();
  return data.data?.[0] ?? null;
}

async function uploadAttachmentToStrapi(file: File, token: string): Promise<number> {
  const uploadForm = new FormData();
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type || "application/octet-stream" });

  uploadForm.append("files", blob, file.name);

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadForm,
  });

  if (!response.ok) {
    const errorData = await safeJson(response);
    console.error("Failed to upload sponsor letter attachment:", errorData);
    throw new Error("Failed to upload attachment");
  }

  const result = await response.json();
  const uploadedFile = Array.isArray(result) ? result[0] : null;

  if (!uploadedFile?.id) {
    throw new Error("Attachment upload did not return a file id");
  }

  return uploadedFile.id;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
