// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createRepoAdmins } from "../../database";

type Data = {
  id: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const repo = await createRepoAdmins();
    const admin = await repo.save({
      nombre: "alan",
      apellido: "garcia",
      email: "agarcia@etec.uba",
    });
    res.status(200).json({ id: admin.id });
  } catch (error) {
    res.status(400);
  }
}
