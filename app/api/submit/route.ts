import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, marks, zone, category, shift, exam } = body;

    await addDoc(collection(db, "scores"), {
      name,
      marks: Number(marks),
      zone,
      category,
      shift,
      exam, // 👈 SAVE THIS
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}