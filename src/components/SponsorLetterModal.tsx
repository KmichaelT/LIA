"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Mail, Paperclip, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SponsorLetterModalProps {
  childDocumentId?: string;
  childId?: number | string;
  childName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.txt,.rtf";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export default function SponsorLetterModal({
  childDocumentId,
  childId,
  childName,
  isOpen,
  onClose,
}: SponsorLetterModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(message.trim() || attachment);
  }, [attachment, message]);

  function resetForm() {
    setSubject("");
    setMessage("");
    setAttachment(null);
    setIsSubmitting(false);
    setSubmitStatus(null);
    setErrorMessage("");
  }

  function handleClose() {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setAttachment(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setAttachment(null);
      setSubmitStatus("error");
      setErrorMessage("Attachment must be smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setAttachment(file);
    setSubmitStatus(null);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setSubmitStatus("error");
      setErrorMessage("Add a letter message, attach a document, or both.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      if (childDocumentId) formData.append("childDocumentId", childDocumentId);
      if (childId !== undefined && childId !== null) formData.append("childId", String(childId));
      formData.append("childName", childName);
      formData.append("subject", subject.trim());
      formData.append("message", message.trim());

      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch("/api/sponsor-letters", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send letter");
      }

      setSubmitStatus("success");
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send letter");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Send a Letter to {childName}
          </DialogTitle>
          <DialogDescription>
            Write your letter here, attach a document, or send both together.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Letter submitted</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your message for {childName} has been saved successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="letter-subject">Subject</Label>
                <Input
                  id="letter-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="A short title for the letter"
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="letter-message">Letter Message</Label>
                <Textarea
                  id="letter-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={`Write your message to ${childName} here...`}
                  className="mt-1 min-h-40"
                  disabled={isSubmitting}
                  rows={6}
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can leave this blank if you only want to send an attachment.
                </p>
              </div>

              <div>
                <Label htmlFor="letter-attachment">Attach a Document</Label>
                <Input
                  id="letter-attachment"
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="mt-1"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Accepted formats: PDF, DOC, DOCX, TXT, RTF. Maximum size: 10MB.
                </p>
                {attachment && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{attachment.name}</span>
                  </div>
                )}
              </div>
            </div>

            {submitStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !canSubmit} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Letter
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
