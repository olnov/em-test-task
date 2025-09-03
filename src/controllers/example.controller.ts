import { exampleService } from '@services/example.service';
import { ExampleResponseDto } from '@dtos/example.res.dto';
import { Request, Response } from 'express';

export const exampleController = async (
  req: Request,
  res: Response<ExampleResponseDto>,
): Promise<void> => {
  try {
    const response: ExampleResponseDto = await exampleService();
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in exampleController:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
