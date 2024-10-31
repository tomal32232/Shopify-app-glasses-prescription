import { Card, Button, InlineStack } from "@shopify/polaris";
import { useState } from "react";
import { useSubmit } from "@remix-run/react";

export function ProductPrescriptionSelector({ product, prescriptionEnabled }) {
  const [isEnabled, setIsEnabled] = useState(prescriptionEnabled);
  const submit = useSubmit();

  const handleToggle = () => {
    const formData = new FormData();
    formData.append("action", "togglePrescription");
    formData.append("productId", product.id);
    formData.append("enabled", !isEnabled);
    
    submit(formData, { method: "POST" });
    setIsEnabled(!isEnabled);
  };

  return (
    <Card>
      <InlineStack align="space-between" blockAlign="center">
        <p>{product.title}</p>
        <Button
          onClick={handleToggle}
          primary={!isEnabled}
        >
          {isEnabled ? "Disable Prescription" : "Enable Prescription"}
        </Button>
      </InlineStack>
    </Card>
  );
}
