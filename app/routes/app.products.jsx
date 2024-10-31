import {
  Page,
  Layout,
  ResourceList,
  Card,
  Text,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { ProductPrescriptionSelector } from "../components/ProductPrescriptionSelector";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  const response = await admin.graphql(`
    query {
      products(first: 50, query: "status:ACTIVE") {
        edges {
          node {
            id
            title
            handle
            status
          }
        }
      }
    }
  `);

  const {
    data: { products },
  } = await response.json();

  const prescriptionProducts = await prisma.productPrescription.findMany({
    where: { active: true },
    select: { productId: true }
  });

  const enabledProductIds = new Set(prescriptionProducts.map(p => p.productId));

  return json({
    products: products.edges.map(({ node }) => ({
      ...node,
      prescriptionEnabled: enabledProductIds.has(node.id)
    }))
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");
  const productId = formData.get("productId");
  const enabled = formData.get("enabled") === "true";

  if (action === "togglePrescription") {
    if (enabled) {
      await prisma.productPrescription.create({
        data: {
          productId,
          active: true
        }
      });
      
      await admin.graphql(`
        mutation {
          productUpdate(input: {
            id: "${productId}",
            metafields: [
              {
                namespace: "custom",
                key: "requires_prescription",
                type: "boolean",
                value: "true"
              }
            ]
          }) {
            product {
              id
            }
          }
        }
      `);
    } else {
      await prisma.productPrescription.deleteMany({
        where: { productId }
      });

      await admin.graphql(`
        mutation {
          productUpdate(input: {
            id: "${productId}",
            metafields: [
              {
                namespace: "custom",
                key: "requires_prescription",
                type: "boolean",
                value: "false"
              }
            ]
          }) {
            product {
              id
            }
          }
        }
      `);
    }
  }

  return json({ success: true });
};

export default function Products() {
  const { products } = useLoaderData();
  const fetcher = useFetcher();

  const handleRefresh = () => {
    fetcher.load("/app/products"); // This will trigger a reload of the products list
  };

  return (
    <Page title="Products">
      <Layout>
        <Layout.Section>
          <InlineStack align="end" gap="300">
            <Button 
              onClick={handleRefresh} 
              primary
              loading={fetcher.state === "loading"}
            >
              Refresh Products
            </Button>
          </InlineStack>
          <Card>
            <ResourceList
              items={products}
              renderItem={(product) => (
                <ResourceList.Item id={product.id}>
                  <ProductPrescriptionSelector 
                    product={product}
                    prescriptionEnabled={product.prescriptionEnabled}
                  />
                </ResourceList.Item>
              )}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
