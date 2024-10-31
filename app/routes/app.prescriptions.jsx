import {
  Page,
  Layout,
  Card,
  Button,
  DataTable,
  Modal,
  Form,
  FormLayout,
  TextField,
  Select,
} from "@shopify/polaris";
import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { PrescriptionForm } from "../components/PrescriptionForm";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  const prescriptionOptions = await prisma.prescriptionOption.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return json({ prescriptionOptions });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "create") {
    await prisma.prescriptionOption.create({
      data: {
        name: formData.get("name"),
        type: formData.get("type"),
        min: parseFloat(formData.get("min")),
        max: parseFloat(formData.get("max")),
        step: parseFloat(formData.get("step")),
        required: formData.get("required") === "true"
      }
    });
  }

  return null;
};

export default function Prescriptions() {
  return (
    <Page title="Prescription Settings">
      <Layout>
        <Layout.Section>
          <PrescriptionForm />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
