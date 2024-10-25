import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "@nextui-org/react";
import { useCallback } from "react";

interface FileImportProps {
  isOpen: boolean;
  onOpenChange: () => void;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  removeFile: () => void;
  importProgress: number;
  handleImport: () => void;
  importing: boolean;
}

export default function FileImport({
  isOpen,
  onOpenChange,
  file,
  setFile,
  error,
  setError,
  removeFile,
  importing,
  importProgress,
  handleImport: handleImport,
}: FileImportProps) {
  const validateFile = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    return validTypes.includes(file.type);
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (validateFile(uploadedFile)) {
        setFile(uploadedFile);
        setError(null);
      } else {
        setError("Please upload a valid CSV or Excel file.");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "max-w-md",
        header: "border-b border-gray-200 dark:border-gray-700",
        footer: "border-t border-gray-200 dark:border-gray-700",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">
                Import CSV or Excel File
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload your file to import data
              </p>
            </ModalHeader>
            <ModalBody>
              {!file && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Drag 'n' drop a CSV or Excel file here, or click to select a
                    file
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Supported formats: .csv, .xlsx, .xls
                  </p>
                </div>
              )}
              {error && (
                <div className="mt-2 flex items-center text-sm text-red-500">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {error}
                </div>
              )}
              {file && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-6 w-6 text-primary mr-2" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeFile}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                  {importing && (
                    <div className="mt-2">
                      <Progress value={importProgress} className="w-full" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Importing... {importProgress}%
                      </p>
                    </div>
                  )}
                  {importProgress === 100 && (
                    <div className="flex items-center text-sm text-green-500 mt-2">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Import successful!
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose} disabled={importing}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleImport}
                disabled={!file || importing}
              >
                {importing ? "Importing..." : "Import"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
