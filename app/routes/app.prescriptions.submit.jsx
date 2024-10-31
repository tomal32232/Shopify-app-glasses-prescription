import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  
  try {
    const formData = await request.formData();
    const leftEyeData = JSON.parse(formData.get("leftEye") || "null");
    const rightEyeData = JSON.parse(formData.get("rightEye") || "null");
    const customerId = formData.get("customerId");

    const prescription = await prisma.customerPrescription.create({
      data: {
        shop: session.shop,
        customerId,
        leftEye: leftEyeData ? JSON.stringify(leftEyeData) : null,
        rightEye: rightEyeData ? JSON.stringify(rightEyeData) : null,
      }
    });

    return json({ 
      status: "success", 
      prescription 
    });

  } catch (error) {
    console.error("Failed to save prescription:", error);
    return json({ 
      status: "error", 
      message: "Failed to save prescription" 
    }, { status: 500 });
  }
};
