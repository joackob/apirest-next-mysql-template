// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { app } from "../../database";

type Data = {
  id?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { nombre, apellido, email } = req.body;
  const { method } = req;
  try {
    switch (method) {
      case "POST":
        const admin = await app.saveAdmin({ nombre, apellido, email });
        res.status(200).json({ id: admin.id });
        break;

      default:
        res.status(400).json({});
        break;
    }
  } catch (error) {
    console.log(typeof error);
    res.status(400).json({});
  }
}
