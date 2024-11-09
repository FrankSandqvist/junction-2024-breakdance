import { reportSchema } from "@/schema/report";
import { put } from "@vercel/blob";

// This is the worst "database" ever.
// I'm sorry, but I have to use it.
// I'm sorry.
// But it's a hackathon, so I'm not sorry.

export async function PUT(request: Request) {
  const body = await request.json();

  const report = reportSchema.safeParse(body);

  if (!report.success) {
    console.error(report.error);
    return Response.json(report.error, { status: 400 });
  }

  const currentReport = await fetch(
    `${process.env.NEXT_PUBLIC_BLOB_ENDPOINT}/report.json`,
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const updatedReports = [...currentReport, report.data];
  await put("report.json", JSON.stringify(updatedReports), {
    access: "public",
    addRandomSuffix: false,
  });

  return Response.json(updatedReports);
}