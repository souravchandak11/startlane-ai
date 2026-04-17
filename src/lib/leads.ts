import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type LeadFormData = {
    name: string;
    business: string;
    email: string;
    phone?: string;
    biggestProblem: string;
    tellUsMore?: string;
};

export async function submitLeadToFirestore(data: LeadFormData) {
    // 1. Save to Firestore
    const docRef = await addDoc(collection(db, 'leads'), {
        ...data,
        status: 'new',
        source: 'website-contact-form',
        submittedAt: serverTimestamp(),
    });

    // 2. Send instant email notification via Web3Forms
    const web3formsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (web3formsAccessKey) {
        try {
            await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: web3formsAccessKey,
                    subject: `New Lead 🔥: ${data.name} from ${data.business}`,
                    from_name: 'StartLane AI Notifier',
                    "Lead Name": data.name,
                    "Business Name": data.business,
                    "Email": data.email,
                    "Phone": data.phone || "Not provided",
                    "Biggest Problem": data.biggestProblem,
                    "Additional Notes": data.tellUsMore || "None",
                })
            });
        } catch (e) {
            console.error("Failed to send email notification", e);
            // We don't throw here so the user still sees "Success" since it's saved in Firestore
        }
    }

    return docRef.id;
}
