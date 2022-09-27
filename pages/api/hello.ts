// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "../../db/data-source";
import { Photo } from "../../db/entity/Photo";
import { connectDB } from "../../db/data-source";

type Data = {
  id: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await connectDB();
    const photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    await AppDataSource.manager.save(photo);
    console.log("Photo has been saved. Photo id is", photo.id);
    res.status(200).json({ id: photo.id });
  } catch (error) {
    res.status(400);
  }
}
