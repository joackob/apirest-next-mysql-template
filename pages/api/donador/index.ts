import type { NextApiRequest, NextApiResponse } from "next";
import { repoDonadores } from "@/lib/RepoDonadores";

type PostDonorResponse = {
  id: number;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "aplication/json");
  const { method } = req;

  try {
    switch (method) {
      case "OPTIONS":
        res.setHeader("Allow", "HEAD, GET, POST, PUT, DELETE");
        res.status(200).end();
        break;
      case "HEAD":
        res.status(200).end();
        break;
      case "POST":
        await createAdmin(req, res);
        break;
      default:
        res.status(405).json({});
        break;
    }
  } catch (error) {
    console.log(typeof error);
    res.status(500).json({});
  }
}

const createAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse<PostDonorResponse>
) => {
  const donor = await repoDonadores.save(req.body);
  const response = {
    id: donor.id,
    url: `${process.env.APIURL}/donador/${donor.id}`,
  };
  res.status(201).setHeader("Location", response.url).json(response);
};
