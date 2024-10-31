import { useSubmit } from "@remix-run/react";
import {
  Card,
  FormLayout,
  TextField,
  Button,
  Grid,
  Text,
} from "@shopify/polaris";
import { useState } from "react";

export function PrescriptionForm() {
  const submit = useSubmit();
  const [leftEye, setLeftEye] = useState({
    sphere: "",
    cylinder: "",
    axis: "",
  });
  const [rightEye, setRightEye] = useState({
    sphere: "",
    cylinder: "",
    axis: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("customerId", "customer-123");
    formData.append("leftEye", JSON.stringify(leftEye));
    formData.append("rightEye", JSON.stringify(rightEye));

    submit(formData, {
      method: "POST",
      action: "/app/prescriptions/submit"
    });
  };

  return (
    <Card sectioned>
      <form onSubmit={handleSubmit}>
        <FormLayout>
          <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
              <Text variant="headingMd" as="h2">Left Eye</Text>
              <FormLayout>
                <TextField
                  label="Sphere"
                  type="number"
                  step="0.25"
                  value={leftEye.sphere}
                  onChange={(value) => setLeftEye({...leftEye, sphere: value})}
                />
                <TextField
                  label="Cylinder"
                  type="number"
                  step="0.25"
                  value={leftEye.cylinder}
                  onChange={(value) => setLeftEye({...leftEye, cylinder: value})}
                />
                <TextField
                  label="Axis"
                  type="number"
                  min="0"
                  max="180"
                  value={leftEye.axis}
                  onChange={(value) => setLeftEye({...leftEye, axis: value})}
                />
              </FormLayout>
            </Grid.Cell>

            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
              <Text variant="headingMd" as="h2">Right Eye</Text>
              <FormLayout>
                <TextField
                  label="Sphere"
                  type="number"
                  step="0.25"
                  value={rightEye.sphere}
                  onChange={(value) => setRightEye({...rightEye, sphere: value})}
                />
                <TextField
                  label="Cylinder"
                  type="number"
                  step="0.25"
                  value={rightEye.cylinder}
                  onChange={(value) => setRightEye({...rightEye, cylinder: value})}
                />
                <TextField
                  label="Axis"
                  type="number"
                  min="0"
                  max="180"
                  value={rightEye.axis}
                  onChange={(value) => setRightEye({...rightEye, axis: value})}
                />
              </FormLayout>
            </Grid.Cell>
          </Grid>

          <Button submit primary>Save Prescription</Button>
        </FormLayout>
      </form>
    </Card>
  );
}
