import React from "react";
import { Button } from "@nextui-org/react";
import { Sparkles } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end gap-4">
      <Button color="danger" variant="flat" type="reset">
        Reset Quantum Matrix
      </Button>
      <Button
        color="primary"
        type="submit"
        isLoading={isSubmitting}
        endContent={<Sparkles className="w-4 h-4" />}
      >
        {isSubmitting ? "Quantum Processing..." : "Register Subject"}
      </Button>
    </div>
  );
};

export default FormActions;
