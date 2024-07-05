import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import cloudinary from 'src/utils/cloudinary';

@Injectable()
export class RipeService {
  constructor(private prismaService: PrismaService) {}

  async create(id: string, file: Express.Multer.File) {
    const apiKey = process.env.GEMINI_API;
    const genAI = new GoogleGenerativeAI(apiKey);

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
    });
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'input: ' },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: Buffer.from(
                  fs.readFileSync(
                    path.resolve('../server/src/assets/apple.jpg'),
                  ),
                ).toString('base64'),
              },
            },
            { text: '​' },
            {
              text: 'output: {"name": "Red Apple", "ripeNess": "80%-90%", "recommendation": "Your fruit is Semi-Ripe. Give it a little bit more time."}',
            },
            { text: 'input: ' },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: Buffer.from(
                  fs.readFileSync(
                    path.resolve('../server/src/assets/lemon.jpg'),
                  ),
                ).toString('base64'),
              },
            },
            { text: '​' },
            {
              text: 'output: {"name": "Lemon", "ripeNess": "90%-100%", "recommendation": "Your fruit is Ripe. Enjoy! "}',
            },
            { text: '​' },
            { text: 'input: ' },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: Buffer.from(
                  fs.readFileSync(
                    path.resolve('../server/src/assets/green-apple.jpg'),
                  ),
                ).toString('base64'),
              },
            },
            { text: '​' },
            {
              text: 'output: {"name": "Green Apple", "ripeNess": "50%-60%", "recommendation": "Your fruit is Unripe. It will ripen within a week. "}',
            },
            { text: '​' },
            { text: 'input: ' },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: Buffer.from(
                  fs.readFileSync(
                    path.resolve('../server/src/assets/banana.jpg'),
                  ),
                ).toString('base64'),
              },
            },
            { text: '​' },
            {
              text: 'output: {"name": "Banana", "ripeNess": "10%-20%", "recommendation": "Your fruit is Unripe. It will ripen next week."}',
            },
            { text: '​' },
            { text: 'input: ' },
            {
              inlineData: {
                mimeType: file.mimetype,
                data: Buffer.from(file.buffer).toString('base64'),
              },
            },
            { text: '​' },
            { text: 'output: ' },
          ],
        },
      ],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      safetySettings,
    });
    const base64String = file.buffer.toString('base64');
    const data64 = `data:${file.mimetype};base64,${base64String}`;
    const data = await cloudinary.uploader.upload(data64, {
      folder: '/ripeoculus',
    });
    if (!data && !result) {
      throw new ForbiddenException();
    }
    await this.prismaService.ripe.create({
      data: {
        images: data.secure_url,
        response: result.response.text(),
        usersId: id,
      },
    });
    return {
      ...JSON.parse(result.response.text()),
      images: data.secure_url,
    };
  }

  findAll(id: string) {
    return this.prismaService.ripe.findMany({
      where: { usersId: id },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
