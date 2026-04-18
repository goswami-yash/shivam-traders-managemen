import config from "config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { storageClient, getSignedUrl, deleteR2Object } from './r2Client.js';
console.log(config.get("App.cloude_r2").PUBLIC_BUCKET_KEY);
const pub = config.get("App.cloude_r2").PUBLIC_BUCKET_KEY;

const BUCKET = config.get("App.config.imageUploadPath_type") === "aws"
    ? config.get("App.cloude_aws").AWS_BUCKET
    : config.get("App.cloude_r2").R2_BUCKET;

async function DynamicSignedURL(type, id, fileName, contentType) {
    try {

        if (!type || !fileName) {
            return { success: false, message: "type and fileName required" };
        }

        // Extract extension
        const ext = fileName.split('.').pop();
        const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/\s/g, "_");
        const safeName = `${baseName}.${ext}`;

        // Auto MIME
        const mimeMap = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
            gif: "image/gif",
            pdf: "application/pdf"
        };
        const mimeType = contentType || mimeMap[ext.toLowerCase()] || "application/octet-stream";

        let objectKey = "";
        const now = new Date();

        const year = now.getFullYear();                
        const month = String(now.getMonth() + 1).padStart(2, "0");

        if (type === "bilty_img") {
            if (!id) return { message: "order number required" };
            objectKey = `Shivam_Traders/bilty/${year}/${month}/${id}_${safeName}`;
        }
        else if (type === "diesel_img") {
            if (!id) return { message: "order number required" };
            objectKey = `Shivam_Traders/diesel/${year}/${month}/${id}_${safeName}`;
        }
        else if (type === "user_img") {
            if (!id) return { message: "user id required" };
            objectKey = `Shivam_Traders/user/${year}/${month}/${id}_${safeName}`;
        }
        else if (type === "vehicle_doc") {
            if (!id) return { message: "vehicle id required" };
            objectKey = `Shivam_Traders/vehicle/${year}/${month}/${id}_${safeName}`;
        }

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: objectKey,
            ContentType: mimeType,
        });
   console.log("Command for Signed URL:", command); // Debugging log
   console.log("Storage Client Config:", storageClient.config); // Debugging log
        const uploadUrl = await getSignedUrl(storageClient, command, { expiresIn: 3600 });
   console.log("Generated Signed URL:", `${pub}/${objectKey}`); // Debugging log
        return {
            success: true,
            uploadUrl,
            objectKey,
        };

    } catch (error) {
        console.error("Dynamic Signed URL Error:", error);
        return { success: false, message: "Failed to create signed URL" };
    }
}

//single iteam delete
async function Dynamic_Delete_R2_Data(objectKey) {
    try {

        if (!objectKey)
            return { success: false, message: "objectKey required" };

        const result = await deleteR2Object(objectKey);

        return result;

    } catch (error) {
        console.error("Delete API Error:", error);
        return{ success: false, message: "Failed to delete" };
    }
}


// module delete
async function Delete_Images_By_Type_And_Months
(types, months = [], year) {
    try {

        const deletedResults = [];
        if (types === 'bilty_img_year') {

            if (year) {

                // 1) Delete bilty year images
                deletedResults.push(await deleteAllByPrefix(`Shivam_Traders/bilty/${year}`));
            }

            // 2) Delete bilty month images
            for (const month of months) {
                deletedResults.push(await deleteAllByPrefix(`Shivam_Traders/bilty/${year}/${month}`));
            }
            return deletedResults;

        } else if (types === 'bilty_img_month') {

            // 1) Delete bilty month images
            for (const month of months) {
                deletedResults.push(await deleteAllByPrefix(`Shivam_Traders/bilty/${year}/${month}`));
            }
            return deletedResults;

        } else if (types === 'diesel_img_year') {

            if (year) {

                // 1) Delete diesel year images
                deletedResults.push(await deleteAllByPrefix(`Shivam_Traders/diesel/${year}`));
            }

            // 2) Delete diesel month images
            for (const month of months) {
                deletedResults.push(await deleteAllByPrefix(`Shivam_Traders/diesel/${year}/${month}`));
            }
            return deletedResults;

        } else if (types === 'diesel_img_month') {

            // 1) Delete each month diesel images
            for (const month of months) {
                deletedResults.push(await deleteAllByPrefix(`Shivam_Traders/diesel/${year}/${month}`));
            }
            return deletedResults;
        }

    } catch (error) {
        console.error("Delete Course Error:", error);
        return { success: false, message: "Failed to delete course files" };
    }
}


export default { 
    DynamicSignedURL,
    Dynamic_Delete_R2_Data ,
    Delete_Images_By_Type_And_Months};