"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export function UploadPdfDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button type="button">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a PDF file to process and chat with. Max size: 16MB.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UploadDropzone
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              setOpen(false);
              router.refresh(); // Refresh the page to show the new document
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
